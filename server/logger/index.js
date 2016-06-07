var log4js = require('log4js');
var log4js_extend = require('log4js-extend');
log4js.configure(require('./log4js.json'));
log4js_extend(log4js, {
    format: "[ @file:@line:@column ]"
});

var defaultLogger = log4js.getLogger('default');
var expressLogger = log4js.connectLogger(log4js.getLogger('express'), {
    level: 'auto',
    format: ':remote-addr -  ' +
    ' REQUEST ":protocol :method :url HTTP/:http-version"' +
    ' RESPONSE ":status :content-lengthb :response-timems"'
});

module.exports = {
    defaultLogger: defaultLogger,
    requestLogger: expressLogger
};