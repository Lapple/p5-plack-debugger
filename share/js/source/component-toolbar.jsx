var _ = require('underscore');
var React = require('react');

var ExpandButton = require('./component-expand-button.jsx');
var Menu = require('./component-menu.jsx');
var Panel = require('./component-panel.jsx');
var Formatter = require('./component-formatter.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            expanded: false,
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

            // TODO: Remove.
            console.log(data);

            return <div className='pdb-panels'>
                <Panel title={ data.title } subtitle={ data.subtitle } notifications={ data.notifications } onClose={ this.closeActivePanel }>
                    <Formatter formatter={ formatter } data={ data.result } />
                </Panel>
            </div>;
        }
    },
    toggle: function() {
        if (this.state.expanded) {
            this.collapse();
        } else {
            this.expand();
        }
    },
    setActivePanel: function(title) {
        this.setState({
            activePanel: title
        });
    },
    closeActivePanel: function() {
        this.setState({
            activePanel: null
        });
    },
    expand: function() {
        this.setState({ expanded: true });
    },
    collapse: function() {
        this.closeActivePanel();
        this.setState({ expanded: false });
    }
});
