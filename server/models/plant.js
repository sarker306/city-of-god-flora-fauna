module.exports = function (sequelize, DataTypes) {
    var Plant = sequelize.define('Plant', {
        ID : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            autoIncrement: true
        },
        NAME : {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        FULL_NAME: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 5
            }
        },
        DESCRIPTION: {
            type: DataTypes.STRING,
            validate: {
                min: 5
            }
        },
        // account will remain inactive until phone number is verified
        // status: pending, active, inactive
        STATUS: {
            type: DataTypes.STRING,
            defaultValue: "pending"
        }
    }, {
        tableName: 'plants',

        classMethods: {
            serial: 2,
            associate: function(models) {
                //Plant.hasOne(models.User, {foreignKey: 'USER_ID' });
            }
        },

        createdAt: 'CREATED_AT',
        updatedAt: 'UPDATED_AT'
    });

    return Plant;
};
