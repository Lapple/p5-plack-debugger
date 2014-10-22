var _ = require('underscore');
var React = require('react');

var Debugger = require('./component-debugger.jsx');
var assert = require('./assert');

var doc = document;

/**
 * Initializes debugger UI
 * @param  {Object} options
 * @param  {String} options.containerId  ID of the UI container element
 * @param  {String} options.cssUrl       Optional URL of CSS file to inject
 * @return {Function}                    UI rendering function
 */
exports.init = function(options) {
    assert(_.isString(options.containerId));

    var container = createContainer(options.containerId);

    if (_.isString(options.cssUrl)) {
        injectStyleSheet(options.cssUrl);
    }

    return function(props) {
        React.renderComponent(Debugger(props), container);
    };
};

function createContainer(id) {
    var el = doc.createElement('div');
    el.setAttribute('id', id);
    return doc.body.appendChild(el);
}

function injectStyleSheet(href) {
    var link = doc.createElement('link');
    var head = doc.getElementsByTagName('head')[0]; // IE8 compatible

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);

    return head.appendChild(link);
}
