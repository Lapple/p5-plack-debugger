module.exports = function(condition, message) {
    if (!condition) {
        throw Error(message);
    }
};
