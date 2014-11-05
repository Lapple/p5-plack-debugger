/* =============================================================== */

var _ = require('underscore');
var Plack = Plack || {};

Plack.Debugger = function () {
    if ( Plack.Debugger.$CONFIG === undefined ) {
        Plack.Debugger.$CONFIG = this._init_config();
    }
}

Plack.Debugger.MAX_RETRIES              = 5;
Plack.Debugger.RETRY_BACKOFF_MULTIPLIER = 1000;

Plack.Debugger.prototype._init_config = function () {
    var init_url = document.getElementById('plack-debugger-js-init').src;

    var config = {
        'current_request_uid' : init_url.split("#")[1]
    };

    var url_parts = init_url.split('/'); 
    url_parts.pop(); config.static_js_url = url_parts.join('/');
    url_parts.pop(); config.static_url    = url_parts.join('/');
    url_parts.pop(); config.root_url      = url_parts.join('/');

    return config;
}

Plack.Debugger.prototype.ready = function ( callback ) {
    var self           = this;
    var ready_callback = function ( $jQuery ) { self._ready( $jQuery, callback ) };

    if ( typeof jQuery == 'undefined' ) {

        var script  = document.createElement('script');
        script.type = 'text/javascript';
        script.src  = Plack.Debugger.$CONFIG.static_js_url + '/jquery.js';

        if (script.readyState) { // IE
            script.onreadystatechange = function () {
                if (script.readyState == 'loaded' || script.readyState == 'complete') {
                    script.onreadystatechange = null;
                    jQuery.noConflict();
                    jQuery(document).ready(ready_callback);
                }
            };
        } 
        else { 
            script.onload = function () {
                jQuery.noConflict();
                jQuery(document).ready(ready_callback);
            };
        }

        document.getElementsByTagName('body')[0].appendChild( script );
    } else {
        jQuery(document).ready(ready_callback);
    }

    return self;
}

Plack.Debugger.prototype._ready = function ( $jQuery, callback ) {
    this.resource = new Plack.Debugger.Resource( $jQuery, this );

    // YAGNI (yet):
    // It might be useful to be able to capture AJAX calls
    // that are made by frameworks other then jQuery, in 
    // which case this needs to get more sophisticated. I 
    // can't easily see a need for it right now, but if 
    // there is a need, it could be done.
    // - SL

    $jQuery(document).ajaxSend( Plack.Debugger.Util.bind_function( this._handle_AJAX_send, this ) );
    $jQuery(document).ajaxComplete( Plack.Debugger.Util.bind_function( this._handle_AJAX_complete, this ) );

    // NOTE:
    // Not sure I see the need for any of this yet, but 
    // we can just leave them here for now.
    // - SL
    // $jQuery(document).ajaxError( Plack.Debugger.Util.bind_function( this._handle_AJAX_error, this ) );    
    // $jQuery(document).ajaxSuccess( Plack.Debugger.Util.bind_function( this._handle_AJAX_success, this ) );
    // $jQuery(document).ajaxStart( Plack.Debugger.Util.bind_function( this._handle_AJAX_start, this ) );
    // $jQuery(document).ajaxStop( Plack.Debugger.Util.bind_function( this._handle_AJAX_stop, this ) );

    this.resource.trigger( 'plack-debugger.resource.request:load' );

    callback.apply( this, [] );
}

Plack.Debugger.prototype._handle_AJAX_send = function (e, xhr, options) {
    xhr.setRequestHeader( 'X-Plack-Debugger-Parent-Request-UID', Plack.Debugger.$CONFIG.current_request_uid );
    // don't send events if they are not tracking them
    if ( this.resource.is_AJAX_tracking_enabled() ) {
        this.resource.trigger('plack-debugger._:ajax-send');
    }
}

Plack.Debugger.prototype._handle_AJAX_complete = function (e, xhr, options) {
    if ( this.resource.is_AJAX_tracking_enabled() ) {
        this.resource.trigger('plack-debugger._:ajax-complete');
    }
}

/* =============================================================== */

// NOTE:
// as we find more and more silly jQuery/JS/browser back-compat
// issues, this is the namespace to put the shims into so that  
// we can move on with our lives.
// - SL

Plack.Debugger.Util = {
    index_of : function ( $element, array ) {
        var idx      = -1; 
        var $siblings = $element.parent().children();
        for ( var i = 0; i < $siblings.length; i++ ) {
            if ( $siblings[i] === $element[0] ) {
                idx = i;
                break;
            }
        }
        return idx;
    },
    // NOTE:
    // This polyfill should be sufficient for 
    // our usage (which is minimal), but just 
    // in case we run into issues, use this:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    object_keys : function ( o ) {
        if ( Object.keys ) return Object.keys( o );
        var keys = [];
        for ( var p in o ) {
            if ( o.hasOwnProperty( p ) ) keys.push( p );
        }
        return keys;
    },
    // NOTE:
    // This polyfill should be sufficient for 
    // our usage (which is very specialized), 
    // but just in case we run into issues, 
    // use this:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    bind_function : function ( f, o ) {
        if ( Function.prototype.bind ) return Function.prototype.bind.apply( f, [ o ] );
        return function () { return f.apply( o, Array.prototype.slice.call(arguments) ) };
    }
};

/* =============================================================== */

Plack.Debugger.Abstract = {};

// ----------------------------------------------------------------
// basic event handling object

Plack.Debugger.Abstract.Eventful = function () {}

Plack.Debugger.Abstract.Eventful.prototype.register = function () { 
    throw new Error('[Abstract Method] you must define a `register` method'); 
}

Plack.Debugger.Abstract.Eventful.prototype.setup_target = function ( $parent, $target ) { 
    this.$parent = $parent;
    this.$target = $target;
}

Plack.Debugger.Abstract.Eventful.prototype.locate_target = function ( $parent, $target ) { 
    if ( this.$parent &&  this.$target ) return this.$parent[ this.$target ];
    if ( this.$parent && !this.$target ) return this.$parent;
    throw new Error("Cannot locate the $target");
}

Plack.Debugger.Abstract.Eventful.prototype.trigger = function ( e, data, options ) { 
    //console.log([ "... triggering " + e + " on ", this, data, options ]);
    //console.trace();
    if ( this._callbacks      === undefined ) return; // handle no events (yet)
    if ( this._callbacks[ e ] === undefined ) {
        //console.log(["... attempting to bubble " + e + " on ", this, data, options ]);
        // not handling this specific event, so ...
        if ( options !== undefined && options.bubble ) {
            // ... attempt to bubble the event to the target 
            this.locate_target().trigger( e, data, options );
        }
        else {
            //console.trace();
            throw new Error("[Unhandled event] This object does not handle event(" + e + ") ... and bubbling was not requested");
        }
    }
    else {
        // otherwise we know we can handle this event, so do it ...
        var self = this;
        // and do it asynchronously ... 
        setTimeout(function () { self._callbacks[ e ].apply( self, [ data ] ) }, 0);
    }
}

// register events ...

Plack.Debugger.Abstract.Eventful.prototype.on = function ( e, cb ) { 
    if ( this._callbacks      === undefined ) this._callbacks = {};
    if ( this._callbacks[ e ] !== undefined ) throw new Error ("An event already exists for <" + e + ">");
    //console.log([ "registering event: " + e + " on ", this, cb ]);
    this._callbacks[ e ] = cb;
}

// unregister events ...

Plack.Debugger.Abstract.Eventful.prototype.off = function ( e ) { 
    if ( this._callbacks      === undefined ) return;
    if ( this._callbacks[ e ] === undefined ) return;
    //console.log(["un-registering event: " + e + " on ", this ]);
    delete this._callbacks[ e ];
}

/* =============================================================== */

Plack.Debugger.Resource = function ( $jQuery, $parent, $target ) {
    this.$jQuery = $jQuery; // the root jQuery object, for Ajax stuff

    this._request          = null;
    this._subrequests      = [];
    this._subrequest_count = 0;
    this._AJAX_tracking    = false;

    this._request_error_count    = 0;
    this._subrequest_error_count = 0;

    this.register();
    this.setup_target( $parent, $target );
}

Plack.Debugger.Resource.prototype = new Plack.Debugger.Abstract.Eventful();

Plack.Debugger.Resource.prototype.register = function () {
    // register for events we handle 
    this.on( 'plack-debugger.resource.request:load',     Plack.Debugger.Util.bind_function( this._load_request, this ) );
    this.on( 'plack-debugger.resource.subrequests:load', Plack.Debugger.Util.bind_function( this._load_all_subrequests, this ) );

    // also catch these global events
    // ... see NOTE below by the registered 
    //     event handler functions themselves
    this.on( 'plack-debugger._:ajax-tracking-enable',  Plack.Debugger.Util.bind_function( this._enable_AJAX_tracking, this ) );
    this.on( 'plack-debugger._:ajax-tracking-disable', Plack.Debugger.Util.bind_function( this._disable_AJAX_tracking, this ) );    
}

Plack.Debugger.Resource.prototype.serialize = function() {
    var r = {};

    var request = this._request;
    var subrequests = this._subrequests;

    if ( request ) {
        r.request = request && request.results;

        _.extend(
            _.findWhere( r.request, { title: 'AJAX Requests' } ),
            { result: subrequests }
        );
    }

    return r;
}

Plack.Debugger.Resource.prototype.is_AJAX_tracking_enabled = function () {
    return this._AJAX_tracking;
}

// ... events handlers

Plack.Debugger.Resource.prototype._load_request = function () {
    this.$jQuery.ajax({
        'dataType' : 'json',
        'url'      : (Plack.Debugger.$CONFIG.root_url + '/' + Plack.Debugger.$CONFIG.current_request_uid),
        'global'   : false,
        'success'  : Plack.Debugger.Util.bind_function( this._update_target_on_request_success, this ),
        'error'    : Plack.Debugger.Util.bind_function( this._update_target_on_request_error, this )
    });
}

Plack.Debugger.Resource.prototype._load_all_subrequests = function () {
    this.$jQuery.ajax({
        'dataType' : 'json',
        'url'      : (
            Plack.Debugger.$CONFIG.root_url 
            + '/' 
            + Plack.Debugger.$CONFIG.current_request_uid
            + '/subrequest'
        ),
        'global'   : false,
        'success'  : Plack.Debugger.Util.bind_function( this._update_target_on_subrequest_success, this ),
        'error'    : Plack.Debugger.Util.bind_function( this._update_target_on_subrequest_error, this )
    });
}

// request ...

Plack.Debugger.Resource.prototype._update_target_on_request_success = function ( response, status, xhr ) {
    this._request             = response;
    this._request_error_count = 0;

    this.trigger( 'plack-debugger.ui:load-request', response.results, { bubble : true } );

    // once the target is updated, we can 
    // just start to ignore the event 
    this.off( 'plack-debugger.resource.request:load' );
}

Plack.Debugger.Resource.prototype._update_target_on_request_error = function ( xhr, status, error ) {
    // don't just throw an error right away, 
    // do a few retries first, the server 
    // might just be a little slow.
    if ( this._request_error_count < Plack.Debugger.MAX_RETRIES ) {
        this._request_error_count++;
        var self = this;
        setTimeout(function () {
            self._load_request();
        }, (this._request_error_count * Plack.Debugger.RETRY_BACKOFF_MULTIPLIER));
        this.trigger( 'plack-debugger.ui:load-request-error-retry', this._request_error_count, { bubble : true } );
    }
    else {
        this.trigger( 'plack-debugger.ui:load-request-error', error, { bubble : true } );
    }
}

// subrequest ...

Plack.Debugger.Resource.prototype._update_target_on_subrequest_success = function ( response, status, xhr ) {
    this._subrequests            = response;
    this._subrequest_error_count = 0

    this.trigger( 'plack-debugger.ui:load-subrequests', response, { bubble : true } );
}

Plack.Debugger.Resource.prototype._update_target_on_subrequest_error = function ( xhr, status, error ) {
    // don't just throw an error right away, 
    // do a few retries first, the server 
    // might just be a little slow.
    if ( this._subrequest_error_count < Plack.Debugger.MAX_RETRIES ) {
        this._subrequest_error_count++;
        var self = this;
        setTimeout(function () {
            self._load_all_subrequests();
        }, (this._subrequest_error_count * Plack.Debugger.RETRY_BACKOFF_MULTIPLIER));
        this.trigger( 'plack-debugger.ui:load-subrequests-error-retry', this._subrequest_error_count, { bubble : true } );
    }
    else {
        this.trigger( 'plack-debugger.ui:load-subrequests-error', error, { bubble : true } );
    }
}

// NOTE:
// These AJAX handlers are hooked to global 
// events such as:
//
//   plack-debugger._:ajax-tracking-enable
//   plack-debugger._:ajax-tracking-disable
//
// as well as then registering for the other 
// generic AJAX events. 
//
// Since these global events might want to 
// be handled elsewhere, do not stop the 
// propagation as we do in other events.
// - SL

// enable/disable AJAX tracking

Plack.Debugger.Resource.prototype._enable_AJAX_tracking = function ( e ) {
    if ( !this._AJAX_tracking ) { // don't do silly things ...
        this.on( 'plack-debugger._:ajax-send',     Plack.Debugger.Util.bind_function( this._handle_ajax_send, this ) );
        this.on( 'plack-debugger._:ajax-complete', Plack.Debugger.Util.bind_function( this._handle_ajax_complete, this ) );        
        this._AJAX_tracking = true;  
    }  
}

Plack.Debugger.Resource.prototype._disable_AJAX_tracking = function ( e ) {
    if ( this._AJAX_tracking ) { // don't do silly things ...
        this.off( 'plack-debugger._:ajax-send' );
        this.off( 'plack-debugger._:ajax-complete' );        
        this._AJAX_tracking = false;    
    }
}

// AJAX tracking event handlers

Plack.Debugger.Resource.prototype._handle_ajax_send = function ( e ) {
    this._subrequest_count++;
}

Plack.Debugger.Resource.prototype._handle_ajax_complete = function ( e ) {
    // NOTE:
    // while it is unlikely that this will get out 
    // of sync, one can never tell so best to just 
    // have this simple check here.
    // - SL
    if ( this._subrequest_count != this._subrequests.length ) {
        this.trigger('plack-debugger.resource.subrequests:load')
    }
}

/* =============================================================== */

module.exports = Plack.Debugger;
