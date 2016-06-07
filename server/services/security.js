var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var promise = require('bluebird');

var log = require('../logger').defaultLogger;
var configs = require('../configs');

var db = require('../models');

function _encrypt(data, cb){
    data = typeof data === 'object'? JSON.stringify(data) : data;
    try{
        var iv = new Buffer(configs.secret.secondary);
        var decodeKey = crypto.createHash('sha256').update(configs.secret.primary, 'binary').digest();
        var cipher = crypto.createCipheriv('aes-256-cbc', decodeKey, iv);
        cb(null, cipher.update(data, 'binary', 'hex') + cipher.final('hex'));
    }
    catch(e){
        cb(e.message, null);
    }
}

function _decrypt(data, cb){
    try{
        var iv = new Buffer(configs.secret.secondary);
        var encodeKey = crypto.createHash('sha256').update(configs.secret.primary, 'binary').digest();
        var cipher = crypto.createDecipheriv('aes-256-cbc', encodeKey, iv);
        cb(null, cipher.update(data, 'hex', 'binary') + cipher.final('binary'));
    }
    catch(e){
        cb(e.message, null);
    }
}

function createHash(str){
    return new promise(function(resolve, reject){
        try{
            var hash = crypto.createHash('md5').update(str).digest('hex');
            resolve(hash);
        }
        catch(ex){
            log.error(e.message);
            reject(e.message);
        }
    });
}

function encrypt(data){
    return new promise(function(resolve, reject){
        _encrypt(data, function(err, encrypted){
            if(err){
                log.error(err);
                reject(new Error(err.message));
            }
            else{
                resolve(encrypted);
            }
        });
    });
}

function decrypt(data){
    return new promise(function(resolve, reject){
        _decrypt(data, function(err, decrypted){
            if(err){
                log.error(err);
                reject(new Error(err.message));
            }
            else{
                resolve(decrypted);
            }
        });
    });
}

function createJwtToken(data){
    return new promise(function(resolve){
        resolve(jwt.sign(data, configs.secret.primary, {
            algorithm: 'HS512',
            audience: configs.domain,
            issuer: configs.appName
        }));
    });
}

function decodeJwtToken(token){
    return new promise(function(resolve, reject){
        jwt.verify(token, configs.secret.primary, {
            algorithm: 'HS512',
            audience: configs.domain,
            issuer: configs.appName
        }, function(err, decoded) {
            if(err){
                log.error(err.message);
                reject(err.message);
            }
            else{
                resolve(decoded);
            }
        });
    });
}

function isAuthenticated(req, res, next) {
  var bearerToken = req.headers['x-access-token'];
  var token = bearerToken ? bearerToken.substr(7) : null;

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, configs.secret.primary, function(err, decoded) {  
      if (err) {
        return res.json({ isError: true, body: { message: 'Failed to authenticate token.' }});    
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded;    
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({ 
        isError: true,
        body:{
            message: 'No token provided.'
        }
    });
    
  }
}

function isAdmin(req, res, next) {
    //Check if user exists
    var journalId = null;
    if (typeof req.user !== 'undefined' ) {
        if (typeof req.body !== 'undefined' && typeof req.body.journalId !== 'undefined' && req.body.journalId) {
            journalId = parseInt(req.body.journalId);
        }
        else if (typeof req.params !== 'undefined' && typeof req.params.journalId !== 'undefined' && req.params.journalId) {
            journalId = parseInt(req.params.journalId);
        }
        else if (typeof req.query !== 'undefined' && typeof req.query.journalId !== 'undefined' && typeof req.query.journalId) {
            journalId = parseInt(typeof req.query.journalId);
        }
        if (req.user.journals.indexOf(journalId) > -1) {
            next();
        }
        else {
            return res.status(403).send({
                isError: true,
                body: {
                    message: 'You don\'t have access to this page'
                }
            });
        }
    } else {
        // if there is no token return an error
        return res.status(403).send({
            isError: true,
            body: {
                message: 'No user is found'
            }
        });
    }
}


function refreshToken(user){
    return jwt.sign(user, configs.secret.primary,{ expiresIn: 60*60*2 });
}

function makeToken(userParam){
    var user = {};
    user.id = userParam.ID;
    user.name = userParam.FULL_NAME;
    user.email = userParam.EMAIL;
    user.phone = userParam.PHONE_NUMBER;

    return jwt.sign(user, configs.secret.primary,{ expiresIn: 60*60*2 });
}

module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
    createHash: createHash,
    isAuthenticated:isAuthenticated,
    isAdmin:isAdmin,
    makeToken:makeToken,
    refreshToken:refreshToken
};