var fs = require('fs');
var promise = require('bluebird');
var configs = require('../configs');
var messages = require('../messages');
var log = require('./../logger/index').defaultLogger;
var bodyParser = require('body-parser');
//var facebook = require('../services/facebook');
var db = require('../models');

module.exports = function(app) {
    // deliver initial html page, which has required frontend scripts
    app.get('*', function (req, res) {
        var primaryLayout = (process.env.NODE_ENV && process.env.NODE_ENV === 'production') ? 'production.html' : 'main.html';
        fs.readFile(configs.publicDir + '/' + primaryLayout, 'utf8', function(err, html){
            if(!err){
                _injectConfig(html).then(function(view){
                    res.setHeader('content-type', 'text/html');
                    res.status(200).send(view);
                });
            } else {
                log.error(err.message);
                res.status(500).end(messages.http.error500);
            }
        });
    });

    app.post('/', bodyParser.json(), bodyParser.urlencoded({ extended: true }), function(req, res, next){
        if(typeof req.body.signed_request !== 'undefined'){
            var signedRequestValue = req.body.signed_request;
            var signedRequest = facebook.fb.parseSignedRequest(signedRequestValue);
            var pageId = signedRequest.page.id;
            db.Shop.findOne({ where : {PAGE_ID:pageId, STATUS:'active' }}).then(function(shop){
                if(shop){
                   res.redirect('/shop/' + shop.ID + '/products');
                } else {
                   res.redirect('/404');
                }
            }).catch(function(err){
                log.error(err.message);
                res.redirect('/404');
            });
        } else {
            res.redirect('/404');
        }
    });

    app.post('/contact',bodyParser.json(),bodyParser.urlencoded({ extended: true }), function(req, res, next){
        if(typeof req.body.name !== 'undefined' && typeof req.body.email !== 'undefined'){
            var name = req.body.name;
            var email = req.body.email;
            var message = req.body.message;
            db.Contact.create({NAME:name, EMAIL:email, MESSAGE:message}).then(function(contact){
                if(contact){
                    res.json({ isError:false })
                } else {
                    res.json({ isError:true })
                }
            }).catch(function(err){
                log.error(err.message);
                res.json({isError:true})
            });
        } else {
            res.json({isError:true})
        }
    });

    function _injectConfig(view){
        var varObj = {};
        varObj.appName = configs.appName;
        varObj.appVersion = configs.appVersion;
        varObj.apiVersion = configs.apiVersion;
        varObj.scriptVersion = configs.scriptVersion;
        varObj.apiUrl = configs.httpUrl + "/" + configs.apiVersion ;
        varObj.cdnUrl = configs.cdn;

        return new promise(function(resolve){
            // find keys of varObj over the document and replace the strings
            // warped by curly braces by corresponding values.
            var pattern = new RegExp('{{.*' + Object.keys(varObj).join('*.}}|{{.*') + '*.}}', 'gi');
            var html = view.replace(pattern, function(match){
                return varObj[match.replace(new RegExp('}}|{{', 'g'), '').trim()];
            });
            resolve(html);
        });
    }
};