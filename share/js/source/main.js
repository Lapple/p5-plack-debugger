// Shims for IE8.
require('es5-shim');
require('es5-shim/es5-sham');

var _ = require('underscore');

var Debugger = require('./plack-debugger');
var ui = require('./ui');

new Debugger().ready(function() {
    var CONTAINER_ID = 'plack-debugger';
    var CSS_URL = Debugger.$CONFIG.static_url + '/css/plack-debugger.css';

    var render = ui.init({
        containerId: CONTAINER_ID,
        cssUrl: CSS_URL
    });

    render();

    this.resource.on('plack-debugger.ui:load-request', function(request) {
        // TODO: Move into Resource.
        if (isAjaxTrackingRequested(request)) {
            this.trigger('plack-debugger._:ajax-tracking-enable');
        }

        render(this.serialize());
    });

    this.resource.on('plack-debugger.ui:load-subrequests', function() {
        render(this.serialize());
    });
});

function isAjaxTrackingRequested(request) {
    return _.some(request, function(r) { return r.metadata && !!r.metadata.track_subrequests; });
}
