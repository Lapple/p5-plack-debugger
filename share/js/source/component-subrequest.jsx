var _ = require('underscore');
var React = require('react');

var Expandable = require('./mixin-expandable');
var Badge = require('./component-badge.jsx');
var Report = require('./component-report.jsx');
var SubrequestPanel = require('./component-subrequest-panel.jsx');

var countNotifications = require('./count-notifications');

module.exports = React.createClass({
    mixins: [ Expandable() ],
    render: function() {
        var props = this.props;
        var notifications = countNotifications(props.results);

        return <div className='pdb-subrequest'>
            <div className='pdb-subrequest-details' onClick={ this.toggle }>
                <div className='pdb-notifications'>
                    { _.map(notifications, this.renderNotification) }
                </div>
                <strong>{ props.uri }</strong>
                <small>
                    { '{' }
                        method: { props.method },
                        request-UID: { props.request_uid },
                        timestamp: { props.timestamp }
                    { '}' }
                </small>
            </div>
            { this.renderContent() }
        </div>
    },
    renderNotification: function(count, type) {
        return <Badge type={ type } count={ count } />;
    },
    renderContent: function() {
        if (this.state.expanded) {
            return <div className='pdb-subrequest-results'>
                {
                    _.map(this.props.results, function(item) {
                        var formatter = item.metadata && item.metadata.formatter;

                        return <SubrequestPanel title={ item.title } subtitle={ item.subtitle } notifications={ item.notifications }>
                            <Report formatter={ formatter} data={ item.result } />
                        </SubrequestPanel>;
                    })
                }
            </div>
        }
    }
});
