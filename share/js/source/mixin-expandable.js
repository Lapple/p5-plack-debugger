module.exports = {
    getInitialState: function() {
        return {
            expanded: false
        };
    },
    toggle: function() {
        this.setState({ expanded: !this.state.expanded });
    }
};
