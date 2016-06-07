var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();

var db = require('../models');
var configs = require('../configs');
var log = require('../logger').defaultLogger;

module.exports = function(app) {
    app.use('/' + configs.apiVersion + '/error', router);
};

router.post('/', bodyParser.json(), function(req, res) {
    log.error("REQ BODY STACK:\n", req.body);
    res.end();
});
