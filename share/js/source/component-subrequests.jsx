var _ = require('underscore');
var React = require('react');

var Subrequest = require('./component-subrequest.jsx');

module.exports = React.createClass({
    render: function() {
        return <div>
            {
                _.map(this.props.requests, function(request) {
                    return Subrequest(_.extend({ key: request.request_uid }, request));
                })
            }
        </div>;
    }
});
