var _ = require('underscore');
var React = require('react');
var assert = require('./assert');

var Table = require('./component-table.jsx');
var Report = React.createClass({
    getDefaultProps: function() {
        return {
            formatter: 'generic_data_formatter'
        };
    },
    render: function() {
        var formatter = this['formatter_' + this.props.formatter];

        assert(_.isFunction(formatter));

        return formatter(this.props.data);
    },
    formatter_empty: function() {
        return <span></span>;
    },
    formatter_to_string: function(data) {
        return <span>{ String(data) }</span>;
    },
    formatter_pass_through: function(data) {
        return <div dangerouslySetInnerHTML={{__html: data}}></div>;
    },
    formatter_generic_data_formatter: function(data) {
        if (_.isString(data) || _.isNumber(data) || _.isUndefined(data)) {
            return this.formatter_to_string(data);
        }

        if (_.isNull(data)) {
            return this.formatter_empty();
        }

        if (_.isArray(data)) {
            return <table className='pdb-item-list'>
                <tbody>
                    {
                        _.map(data, function(item, index) {
                            return <tr key={ index }>
                                <td className='pdb-item'>
                                    <Report data={ item } />
                                </td>
                            </tr>;
                        })
                    }
                </tbody>
            </table>;
        }

        if (_.isObject(data)) {
            return <table className='pdb-key-value-pairs'>
                <tbody>
                    {
                        _.map(data, function(value, key) {
                            return <tr key={ key }>
                                <td className='pdb-key'>{ key }</td>
                                <td className='pdb-value'>
                                    <Report data={ value } />
                                </td>
                            </tr>;
                        })
                    }
                </tbody>
            </table>;
        }

        throw new Error('[Bad Formatter Args] "generic_data_formatter" expected type { String,Number,Array,Object }');
    },
    formatter_nested_data: function(data) {
        if (_.isString(data) || _.isNumber(data) || _.isUndefined(data)) {
            return this.formatter_to_string(data);
        }

        if (_.isEmpty(data)) {
            return this.formatter_empty();
        }

        if (_.isArray(data)) {
            return <ul className='pdb-ulist'>
                {
                    _.map(data, function(item, index) {
                        return <li className='pdb-ulist-item' key={ index }>
                            <Report formatter='nested_data' data={ item } />
                        </li>;
                    })
                }
            </ul>;
        }

        if (_.isObject(data)) {
            return <ul className='pdb-ulist'>
                {
                    _.map(data, function(value, key) {
                        return <li className='pdb-ulist-item' key={ key }>
                            <span className='pdb-key'>{ key }</span>
                            <span className='pdb-value'>
                                <Report formatter='nested_data' data={ value } />
                            </span>
                        </li>;
                    })
                }
            </ul>;
        }

        throw new Error('[Bad Formatter Args] "nested_data" expected type { String,Number,Array,Object }');
    },
    formatter_ordered_key_value_pairs: function(data) {
        assert(_.isArray(data), '[Bad Formatter Args] "ordered_key_value_pairs" expected an Array');
        assert(is_even(data.length), '[Bad Formatter Args] "ordered_key_value_pairs" expected an even length Array');

        return this.formatter_generic_data_formatter(ordered_pairs_to_object(data));
    },
    formatter_ordered_keys_with_nested_data: function(data) {
        if (!data) {
            return '';
        }

        assert(_.isArray(data), '[Bad Formatter Args] "ordered_nested_data" expected an Array');
        assert(is_even(data.length), '[Bad Formatter Args] "ordered_nested_data" expected an even length Array');

        return this.formatter_nested_data(ordered_pairs_to_object(data));
    },
    formatter_simple_data_table: function(data) {
        assert(_.isArray(data), '[Bad Formatter Args] "simple_data_table" expected an Array');

        return <Table data={ data } />
    },
    formatter_simple_data_table_w_headers: function(data) {
        assert(_.isArray(data), '[Bad Formatter Args] "simple_data_table_w_headers" expected an Array');

        return <Table data={ data } has_header={ true } />
    },
    formatter_multiple_data_table: function(data) {
        assert(_.isArray(data), '[Bad Formatter Args] "multiple_data_table" expected an Array');
        assert(is_even(data.length), '[Bad Formatter Args] "multiple_data_table" expected an even length Array');

        return <div>
            {
                _.map(ordered_pairs_to_object(data), function(value, key) {
                    return <div>
                        <h1>{ key }</h1>
                        <Table data={ value } />
                        <br />
                    </div>;
                })
            }
        </div>;
    },
    formatter_multiple_data_table_w_headers: function(data) {
        assert(_.isArray(data), '[Bad Formatter Args] "multiple_data_table" expected an Array');
        assert(is_even(data.length), '[Bad Formatter Args] "multiple_data_table" expected an even length Array');

        return <div>
            {
                _.map(ordered_pairs_to_object(data), function(value, key) {
                    return <div>
                        <h1>{ key }</h1>
                        <Table data={ value } has_header={ true } />
                        <br />
                    </div>;
                })
            }
        </div>;
    }
});

function is_even(number) {
    return number % 2 === 0;
}

/**
 * Converts `[k1, v1, k2, v2, ...]` to `{k1: v1, k2: v2, ...}`
 * @param  {Array} list
 * @return {Object}
 */
function ordered_pairs_to_object(list) {
    var object = {};

    for (var i = 0; i < list.length; i += 2) {
        object[list[i]] = list[i + 1];
    }

    return object;
}

module.exports = Report;
