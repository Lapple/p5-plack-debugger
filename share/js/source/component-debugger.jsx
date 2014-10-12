var _ = require('underscore');
var key = require('keymaster');
var React = require('react');

var Expandable = require('./mixin-expandable');
var Menu = require('./component-menu.jsx');
var Panel = require('./component-panel.jsx');
var Report = require('./component-report.jsx');
var Subrequests = require('./component-subrequests.jsx');
var ExpandButton = require('./component-expand-button.jsx');

module.exports = React.createClass({
    mixins: [ Expandable() ],
    getDefaultProps: function() {
        return {
            request: [],
            subrequests: []
        };
    },
    getInitialState: function() {
        return {
            activePanel: null
        };
    },
    render: function() {
        return <div>
            { this.renderMenu() }
            { this.renderActivePanel() }
            <ExpandButton onClick={ this.toggle } />
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
                        // TODO: Subrequests can be stored in `results` field
                        // for the AJAX requests section of `request`.
                        formatter === 'subrequest_formatter' ?
                        Subrequests({ requests: this.props.subrequests }) :
                        Report({ formatter: formatter, data: data.result })
                    }
                </Panel>
            </div>;
        }
    },
    componentDidMount: function() {
        key('esc', this.toggle);
    },
    componentWillUnmount: function () {
        key.unbind('esc', this.toggle);
    },
    setActivePanel: function(title) {
        this.setState({ activePanel: title });
    },
    closeActivePanel: function() {
        this.setState({ activePanel: null });
    }
});
