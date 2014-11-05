var _ = require('underscore');

module.exports = function(rows) {
    return _.reduce(rows, function(memo, row) {
        var notifications = row.notifications;

        if (notifications) {
            return {
                error: memo.error + (notifications.error || 0),
                success: memo.success + (notifications.success || 0),
                warning: memo.warning + (notifications.warning || 0)
            };
        } else {
            return memo;
        }
    }, {
        error: 0,
        success: 0,
        warning: 0
    });
};
