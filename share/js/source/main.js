var React = require('react');
var Plack_Debugger = require('./plack-debugger');
var Toolbar = require('./component-toolbar.jsx');

var CONTAINER_ID = 'plack-debugger';

new Plack_Debugger().ready(function() {
    var container_element = create_container(CONTAINER_ID);

    // Initial render.
    render(null, container_element);

    // Main request details arrived.
    this.resource.on('plack-debugger.ui:load-request', function(request) {
        render({ request: request }, container_element);
    });
});

function create_container(id) {
    var el = document.createElement('div');
    el.setAttribute('id', id);
    return document.body.appendChild(el);
}

function render(props, container) {
    React.renderComponent(new Toolbar(props), container);
}
