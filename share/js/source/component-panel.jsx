var _ = require('underscore');
var React = require('react');

var Badge = require('./component-badge.jsx');

module.exports = React.createClass({
    render: function() {
        return <div className="pdb-panel">
            <div className="pdb-header">
                { this.renderCloseButton() }
                <div className="pdb-notifications">
                    { _.map(this.props.notifications, this.renderNotification) }
                </div>
                <div className="pdb-title">
                    { this.props.title }
                </div>
                <div className="pdb-subtitle">
                    { this.props.subtitle }
                </div>
            </div>
            <div className="pdb-content">
                { this.props.children }
            </div>
        </div>;
    },
    renderCloseButton: function() {
        if (_.isFunction(this.props.onClose)) {
            return <div className="pdb-close-button" onClick={ this.props.onClose }></div>;
        }
    },
    renderNotification: function(count, type) {
        return <Badge type={ type } count={ count } labelled={ true } />;
    }
});
