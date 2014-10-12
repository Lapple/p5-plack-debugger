var _ = require('underscore');
var React = require('react');

var Expandable = require('./mixin-expandable');

// TODO: Toggle leaf functionality
// TODO: Search

var Tree = React.createClass({
    mixins: [ Expandable({ expanded: true }) ],
    render: function() {
        return <div>
            { this.renderControls() }
            <ul className='pdb-ulist'>
                { _.isArray(this.props.data) ? this.renderArray() : this.renderObject() }
            </ul>
        </div>;
    },
    renderControls: function() {
        if (this.props.root) {
            return <div className='pdb-controls'>
                <button className='pdb-control pdb-open' disabled={ this.state.expanded } onClick={ this.toggle }>
                    open
                </button>
                <button className='pdb-control pdb-close' disabled={ !this.state.expanded } onClick={ this.toggle }>
                    close
                </button>
            </div>
        }
    },
    renderArray: function() {
        return _.map(this.props.data, function(item, index) {
            return <li className='pdb-ulist-item' key={ index }>
                { this.renderSubtree(item) }
            </li>;
        }, this);
    },
    renderObject: function() {
        return _.map(this.props.data, function(value, key) {
            return <li className='pdb-ulist-item' key={ key }>
                <span className='pdb-key'>{ key }</span>
                <span className='pdb-value'>
                    { this.renderSubtree(value) }
                </span>
            </li>;
        }, this);
    },
    renderSubtree: function(data) {
        if (!this.state.expanded || _.isEmpty(data)) {
            return;
        }

        if (_.isArray(data) || _.isObject(data)) {
            return <Tree data={ data } />;
        } else {
            return String(data);
        }
    }
});

module.exports = Tree;
