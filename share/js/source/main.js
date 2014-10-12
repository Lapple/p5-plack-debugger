var _ = require('underscore');
var React = require('react');
var Plack_debugger = require('./plack-debugger');
var Debugger_component = require('./component-debugger.jsx');

var CONTAINER_ID = 'plack-debugger';

new Plack_debugger().ready(function() {
    var container_element = create_container(CONTAINER_ID);
    var render = create_renderer(container_element);

    render();

    this.resource.on('plack-debugger.ui:load-request', function(request) {
        // TODO: Move into Resource.
        if (check_for_ajax_tracking(request)) {
            this.trigger('plack-debugger._:ajax-tracking-enable');
        }

        render({ request: request });
    });

    this.resource.on('plack-debugger.ui:load-subrequests', function(subrequests) {
        render({ subrequests: subrequests });
    });
});

function create_container(id) {
    var el = document.createElement('div');
    el.setAttribute('id', id);
    return document.body.appendChild(el);
}

function create_renderer(container) {
    var _props = {};

    return function(props) {
        _.extend(_props, props);
        React.renderComponent(Debugger_component(_props), container);
    };
}

function check_for_ajax_tracking(request) {
    return _.some(request, function(r) { return r.metadata && !!r.metadata.track_subrequests; });
}
