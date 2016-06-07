var bodyParser = require('body-parser');

var express = require('express');
var router = express.Router();

var promise = require('bluebird');

var security = require('../services/security');
//var sms = require('../services/sms');

var db = require('../models');
//var messages = require('../messages');

var configs = require('../configs');
var log = require('../logger').defaultLogger;

var Plant = db.Plant;

var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

module.exports = function (app) {
    app.use('/' + configs.apiVersion + '/plant', router);
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/:plantId/public-info', function(req, res){
    if(req.params.plantId && /^\d+$/.test(req.params.plantId)){
        Plant.findOne({ where: { ID: req.params.plantId, STATUS: 'active' }}).then(function(plant){
            var obj = {};
            
            obj.id = plant.ID;
            obj.name = plant.NAME;
            obj.fullName = plant.FULL_NAME;
            obj.description = plant.DESCRIPTION;
            
            res.json({isError: false, body: { plant: obj }});
        }).catch(function (err) {
            log.error(err.message);
            res.json({isError: true, body: { message: err.message }});
        });
    } else {
        res.json({isError: true, body: {message: 'inappropriate plant id'}});
    }
});

/*Security*/
//router.use(security.isAuthenticated);

router.get('/', function (req, res, next) {
    Plant.findAll({STATUS: 'active'}).then(function (result) {
        res.json({'isError': false, body: {'plants': result}});
    }).catch(function (error) {
        log.error(error);
        res.json({'isError': true, body: {'plants': [], 'message': "Couldn't find any plant"}});
    });
});

router.post('/', function (req, res, next) {
    var userId = req.user.id;
    var accessToken = req.body.accessToken;
    
    res.json({'isError':true, body: {'message': 'You cannot add any plant yet'}});
});

router.delete('/:plantId', security.isAdmin, function (req, res, next) {
    res.json({'isError':true, body: {'message': 'You cannot delete any plant yet'}});
});
