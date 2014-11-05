var _ = require('underscore');
var key = require('keymaster');
var React = require('react');

var Expandable = require('./mixin-expandable');
var Menu = require('./component-menu.jsx');
var Panel = require('./component-panel.jsx');
var Report = require('./component-report.jsx');
var Subrequests = require('./component-subrequests.jsx');
var ExpandButton = require('./component-expand-button.jsx');

var countNotifications = require('./count-notifications');

var TOGGLE_KEY = 'esc';

module.exports = React.createClass({
    mixins: [ Expandable() ],
    getDefaultProps: function() {
        return {
            request: []
        };
    },
    getInitialState: function() {
        return {
            activePanel: null
        };
    },
    render: function() {
        var notifications = countNotifications(this.props.request);
        var expandButtonClassName = '';

        if (notifications.error > 0) {
            expandButtonClassName = 'pdb-has-errors';
        } else if (notifications.warning > 0) {
            expandButtonClassName = 'pdb-has-warnings';
        }

        return <div>
            { this.renderMenu() }
            { this.renderActivePanel() }
            <ExpandButton className={ expandButtonClassName } onClick={ this.toggle } />
        </div>;
    },
    renderMenu: function() {
        if (this.state.expanded) {
            return <Menu buttons={ this.props.request } onClick={ this.setActivePanel } />;
        }
    },
    renderActivePanel: function() {
        if (this.state.expanded && this.state.activePanel) {
            var data = _.findWhere(this.props.request, { title: this.state.activePanel });
            var formatter = data.metadata && data.metadata.formatter;

            return <div className='pdb-panels'>
                <Panel title={ data.title } subtitle={ data.subtitle } notifications={ data.notifications } onClose={ this.closeActivePanel }>
                    {
                        formatter === 'subrequest_formatter' ?
                        Subrequests({ requests: data.result }) :
                        Report({ formatter: formatter, data: data.result })
                    }
                </Panel>
            </div>;
        }
    },
    componentDidMount: function() {
        key(TOGGLE_KEY, this.toggle);
    },
    componentWillUnmount: function () {
        key.unbind(TOGGLE_KEY, this.toggle);
    },
    setActivePanel: function(title) {
        this.setState({ activePanel: title });
    },
    closeActivePanel: function() {
        this.setState({ activePanel: null });
    }
});
