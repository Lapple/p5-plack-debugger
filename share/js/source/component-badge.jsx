var React = require('react');

module.exports = React.createClass({
    render: function() {
        if (this.props.count > 0) {
            return <div className={ 'pdb-badge pdb-' + this.props.type }>
                { this.props.labelled ? this.props.type + ' (' : '' }
                <span>
                    { this.props.count }
                </span>
                { this.props.labelled ? ')' : '' }
            </div>;
        } else {
            return <span></span>;
        }
    }
});
