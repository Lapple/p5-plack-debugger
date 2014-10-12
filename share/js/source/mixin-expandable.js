var _ = require('underscore');

module.exports = function(initialState) {
    var state = _.defaults(initialState || {}, {
        expanded: false
    });

    return {
        getInitialState: _.constant(state),
        toggle: function() {
            this.setState({ expanded: !this.state.expanded });
        }
    };
};
