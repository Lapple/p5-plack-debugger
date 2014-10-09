var _ = require('underscore');
var React = require('react');

var Badge = require('./component-badge.jsx');

module.exports = React.createClass({
    render: function() {
        return <div className='pdb-button' onClick={ this.props.onClick }>
            <div className='pdb-notifications'>
                { _.map(this.props.notifications, this.renderNotification) }
            </div>
            <div className='pdb-title'>{ this.props.title }</div>
            <div className='pdb-subtitle'>{ this.props.subtitle }</div>
        </div>;
    },
    renderNotification: function(count, type) {
        return <Badge type={ type } count={ count } />;
    }
});
