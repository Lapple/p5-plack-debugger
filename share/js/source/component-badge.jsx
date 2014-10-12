var React = require('react');

module.exports = React.createClass({
    render: function() {
        if (this.props.count > 0) {
            return <div className={ 'pdb-badge pdb-' + this.props.type }>
                { this.renderContent() }
            </div>;
        } else {
            return <span></span>;
        }
    },
    renderContent: function() {
        if (this.props.labelled) {
            return this.props.type + ' (' + this.props.count + ')';
        } else {
            return this.props.count;
        }
    }
});
