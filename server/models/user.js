module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        ID : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        // multiple social platform may have to support,
        // in that case fb id cloud be null
        /*FACEBOOK_ID : {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },*/
        FULL_NAME: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 5
            }
        },
        // phone number is primary contact media
        PHONE_NUMBER : {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true,
            validate:{
                is: /^[^0]\d{8,15}$/
            }
        },
        ADDRESS: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: {
                    args: [12, 128],
                    msg: "Address must be between 12 to 128 characters in length"
                }
            }
        },
        // email is optional communication media
        EMAIL : {
            type: DataTypes.STRING,
            unique: true,
            allowNull:true,
            validate: {
                isEmail: true
            }
        },
        PHONE_IS_VERIFIED: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        // account will remain inactive until phone number is verified
        // status: pending, active, inactive
        STATUS: {
            type: DataTypes.STRING,
            defaultValue: "pending"
        }
    }, {
        tableName: 'users',

        classMethods: {
            serial: 1,
            associate: function(models) {
                //User.hasMany(models.Posts, {foreignKey: 'USER_ID' });
                //User.hasMany(models.Comments, {foreignKey: 'USER_ID' });
                //User.hasMany(models.Plant, {foreignKey: 'USER_ID'});
            }
        },

        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT'
    });

    return User;
};
