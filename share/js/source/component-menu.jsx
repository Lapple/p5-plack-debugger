var _ = require('underscore');
var React = require('react');

var Button = require('./component-menu-button.jsx');

module.exports = React.createClass({
    render: function() {
        // TODO: Change to `menu`.
        return <div className='pdb-toolbar'>
            <div className='pdb-buttons'>
                { _.map(this.props.buttons, this.renderButton) }
            </div>
        </div>;
    },
    renderButton: function(data) {
        return <Button
            title={ data.title }
            subtitle={ data.subtitle }
            notifications={ data.notifications }
            key={ data.title }
            onClick={ _.partial(this.props.onClick, data.title) } />;
    }
});