var http = require('http'),
  https = require('https'),
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  favicon = require('serve-favicon'),
  promise = require('bluebird');
  
var db = require('./models');

var userCtrl = require('./controllers/user');
var plantCtrl = require('./controllers/plant');
var defaultCtrl = require('./controllers/default');
var errorCtrl = require('./controllers/error-handler.js');

var configs = require('./configs');
var logger = require('./logger');
var log = logger.defaultLogger;

function Server() {
  var self = this;
  this.app = express();
  
  // database authentication and models migration
  this.loadModels = function() {
    db.sequelize.authenticate().then(function(){
        if(configs.orm.syncDatabase){
            promise.each(db.models, function(modelName){
                return db[modelName].sync();
            }).then(function(names){
                log.info(names + " created");
            }).error(function(err){
                log.error(err.message);
            });
        }
        else{
            log.warn('configs.orm.syncDatabase:%s', configs.orm.syncDatabase);
        }
    }).error(function(err){
        log.error(err.message);
    });
  };
  
  // middleware for express
  this.setupExpressMiddleware = function() {
    self.app.use(logger.requestLogger);
  };
  
  // routes and resource
  this.defineRoutes = function() {
    self.app.use(express.static(configs.publicDirectory, {maxAge : '1d'}));
    self.app.use(express.static(configs.tempDirectory, {maxAge : '1d'}));
    self.app.use(favicon(configs.publicDirectory + '/favicon.ico'));
    
    userCtrl(self.app);
    plantCtrl(self.app);
    
    // default and error controllers
    errorCtrl(self.app);
    //defaultCtrl(self.app);
  };
  
  // catch termination signal
  this.terminator = function(signal){
    if (typeof signal === "string") {
      log.warn('Received signal %s - terminating %s', signal, configs.appName);
        process.exit(1);
    }
    log.warn('Node app has stopped');
  };

  // termination handlers
  this.terminationHandlers = function(){
    process.on('exit', function() {
      self.terminator();
    });

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
       'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element) {
      process.on(element, function() {
        self.terminator(element);
      });
    });
  };

    // start the app
  this.start = function() {
    this.terminationHandlers();
    http.createServer(this.app).listen(configs.port);
    log.info('%s has started on http://%s:%s', configs.appName, configs.domain, configs.port);
    //https.createServer(this.ssl, this.app).listen(configs.httpsPort);
    //log.info('%s has started on https://%s:%s', configs.appName, configs.domain, configs.httpsPort);
  };
}

var server = new Server();
server.loadModels();
server.setupExpressMiddleware();
server.defineRoutes();

server.start();
