var fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    config = require('../configs'),
    db = {};

// Sequelize itself enable pooling when it gets non-empty pool object,
// properties into define are application to all models,
// replication config will be added when it is required

var sequelize = new Sequelize(
    config.mysql.database,
    config.mysql.user,
    config.mysql.password, {
        dialect: config.orm.dialect,
        host: config.mysql.host,
        port: config.mysql.port,
        pool: {
            maxConnections: config.mysql.minPoolConnections,
            minConnections: config.mysql.maxPoolConnections
        },
        define: {
            timestamps: true,
            charset: config.mysql.charset,
            collate: config.mysql.collate
        },
        logging: config.orm.logging
    }
);

// just storing models string names
db.models = [];

// read models
fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.js') > 0) && (file !== 'index.js');
}).forEach(function (file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
    db.models.push(model.name);
});

// As we have foreign key constrain,
// therefore models should follow correct order
db.models.sort(function(a, b){
    return db[a].serial - db[b].serial;
});

// Association of relational models
Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = exports = db;
