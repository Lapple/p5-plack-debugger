var _ = require('underscore');
var React = require('react');

var Badge = require('./component-badge.jsx');

module.exports = React.createClass({
    render: function() {
        var props = this.props;

        return <div className='pdb-subrequest'>
            <div class='pdb-subrequest-details'>
                <div class='pdb-notifications'>
                    { _.map(props.notifications, this.renderNotification) }
                </div>
                <strong>{ props.uri }</strong>
                <small>
                    [
                        method: { props.method },
                        request-UID: { props.request_uid },
                        timestamp: { props.timestamp }
                    ]
                </small>
            </div>
            <div class='pdb-subrequest-results'>
                Results
            </div>
        </div>
    },
    renderNotification: function(count, type) {
        return <Badge type={ type } count={ count } />;
    }
});

//     out += '<div class="pdb-subrequest-results">';
//         for ( var j = 0; j < data[i].results.length; j++ ) {
//             var result        = data[i].results[j];
//             var notifications = result.notifications;
//             out += 
//             '<div class="pdb-subrequest-result">' 
//                 + '<div class="pdb-subrequest-header">' 
//                     + ((notifications) 
//                         ?  '<div class="pdb-notifications">' 
//                                 + ((notifications.warning) ? '<div class="pdb-badge pdb-warning">' + notifications.warning + '</div>' : '')
//                                 + ((notifications.error)   ? '<div class="pdb-badge pdb-error">'   + notifications.error   + '</div>' : '')
//                                 + ((notifications.success) ? '<div class="pdb-badge pdb-success">' + notifications.success + '</div>' : '')
//                             + '</div>'
//                         : '')
//                     + '<div class="pdb-title">' + result.title    + '</div>'
//                 + '</div>'
//                 + '<div class="pdb-subrequest-result-data">';
//                     // FIXME: this code right below here is ugly and confusing 
//                     if ( result.metadata && result.metadata.formatter ) {
//                         out += this[ result.metadata.formatter ].formatter.apply( this, [ result.result ] );
//                     } 
//                     else {
//                         out += this.generic_data_formatter.formatter.apply( this, [ result.result ] );
//                     }
//                 out += '</div>'
//             + '</div>';
//         }
//     out += '</div>';
// out += '</div>';