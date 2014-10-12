var _ = require('underscore');
var React = require('react');

var Expandable = require('./mixin-expandable');
var Badge = require('./component-badge.jsx');

module.exports = React.createClass({
    mixins: [ Expandable() ],
    render: function() {
        return <div className="pdb-subrequest-result">
            <div className="pdb-subrequest-header" onClick={ this.toggle }>
                <div className="pdb-notifications">
                    { _.map(this.props.notifications, this.renderNotification) }
                </div>
                <div className="pdb-title">
                    { this.props.title }
                </div>
            </div>
            { this.renderContent() }
        </div>;
    },
    renderNotification: function(count, type) {
        return <Badge type={ type } count={ count } />;
    },
    renderContent: function() {
        if (this.state.expanded) {
            return <div className="pdb-subrequest-result-data">
                { this.props.children }
            </div>;
        }
    }
});
