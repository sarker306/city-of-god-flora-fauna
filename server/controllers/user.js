var bodyParser = require('body-parser');

var db = require('../models');
var messages = require('../messages');
var configs = require('../configs');
var log = require('../logger').defaultLogger;

var jwt = require('jsonwebtoken');
var security = require('../services/security');

var express = require('express');
var router = express.Router();

module.exports = function (app) {
    app.use('/' + configs.apiVersion + '/user', router);
};

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/:userId/public-info', function(req, res){
    if(req.params.userId && /^\d+$/.test(req.params.userId)){
        db.User.findOne({ where: { ID: req.params.userId, STATUS: 'active' }}).then(function(user){
            var obj = {};
            
            obj.id = user.ID;
            obj.name = user.FULL_NAME;
            obj.status = user.STATUS;
            
            res.json({isError: false, body: { user: obj }});
        }).catch(function (err) {
            log.error(err.message);
            res.json({isError: true, body: { message: err.message }});
        });
    } else {
        res.json({isError: true, body: {message: 'inappropriate user id'}});
    }
});

// curl -H "Content-Type: application/json" -X POST -d '{"email":"", "phoneNo": ""}' http://localhost:3000/v1/user/
// email is required
router.post('/', function(req, res) {
  if ( req.body.email && req.body.phoneNo ) {
    var resObj = {};
    db.User.findOne({where : { EMAIL : req.body.email }}).then(function(user){
      var obj = {};
      obj.isNew = false;
      obj.user = {}
      obj.user.id = user.ID;
      obj.user.email = user.EMAIL;
      obj.user.name = user.FULL_NAME;
      obj.user.status = user.STATUS;
      
      if ( obj.user.status === 'active') {
        security.makeToken(user).then(function(token){
          console.log("In router Post of user controller, makeToken returned: ", token);
          obj.token = token;
          res.json({isError: false, body: { result : obj }});
        });
      } else res.json({isError: true, body: {message: 'User probably not active'}});
    })
    .catch(function(error) {
      res.json({isError: true, body: {message: 'An error occurred'}});
    });
  } else {
    db.User.create({
      FULL_NAME: req.body.name,
      EMAIL: req.body.email,
      STATUS: req.body.status || 'pending',
      PHONE_NUMBER: req.body.phoneNo || null 
    }).then(function(user){
      res.json({isError: false, body: { user: user }});
    }).catch(function(error){
      res.json({isError: false, body: {message: 'Error occured,' + error.message }});
    });
  }
});
