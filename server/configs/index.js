var log = require('../logger').defaultLogger;

var path = require('path');
var env = {
    development: require('./dev.json')
};

var envVariables = env[process.env.NODE_ENV] || env['development'];
var httpConf = require('./identity/http.json');
//var fbConf = require('./identity/fb.json');

var imageUploadDir = path.normalize(__dirname + '/../../public/images');
var tempUploadDir = path.normalize(__dirname + '/../../../tmp');

//console.log(path.join(tempUploadDir, 'uploads'));

module.exports = {
    appName: envVariables.appName,
    appVersion: envVariables.appVersion,
    scriptVersion: envVariables.scriptVersion,
    apiVersion: envVariables.apiVersion,
    ip: httpConf.ip,
    domain: httpConf.domain,
    port: httpConf.port,
    httpsPort: httpConf.httpsPort,
    httpUrl: httpConf.httpUrl,
    httpsUrl: httpConf.httpsUrl,
    cdn: httpConf.cdn,
    publicUrl: envVariables.publicUrl,
    orm: envVariables.orm,
    mysql: envVariables.mysql,
    redis: envVariables.redis,
    secret : envVariables.secret,
    serverDirectory: path.normalize(__dirname + '/..'),
    publicDirectory: path.normalize(__dirname + '/../../public'),
    imageDirectory: imageUploadDir,
    tempDirectory: tempUploadDir
};