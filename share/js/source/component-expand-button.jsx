var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className='pdb-collapsed'>
            <div className='pdb-open-button' onClick={ this.props.onClick }></div>
        </div>;
    }
});
