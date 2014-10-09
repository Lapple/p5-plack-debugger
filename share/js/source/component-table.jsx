var _ = require('underscore');
var React = require('react');

module.exports = React.createClass({
    render: function() {
        var data = this.props.data;
        var thead, tbody;

        if (this.props.has_header) {
            thead = _.head(data, 1);
            tbody = _.tail(data);
        } else {
            tbody = data;
        }

        return <table className='pdb-data-table'>
            <thead>
                { _.map(thead, _.partial(this.renderRow, this.renderTableHead)) }
            </thead>
            <tbody>
                { _.map(tbody, _.partial(this.renderRow, this.renderTableCell)) }
            </tbody>
        </table>;
    },
    renderTableHead: function(value, index) {
        return <th key={ index }>{ value }</th>;
    },
    renderTableCell: function(value, index) {
        return <td key={ index }>{ value }</td>;
    },
    renderRow: function(col, list, index) {
        return <tr key={ index }>{ _.map(list, col) }</tr>;
    }
});
