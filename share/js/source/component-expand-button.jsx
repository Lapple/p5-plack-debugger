var React = require('react');

module.exports = React.createClass({
    render: function() {
        return <div className='pdb-collapsed'>
            <div className={ 'pdb-open-button ' + this.props.className } onClick={ this.props.onClick }></div>
        </div>;
    }
});
