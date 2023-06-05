module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        encryptedPassword: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
        salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
    }, {
        timestamps: false
    });
    User.associate = function(models) {
        User.belongsTo(models.Role);
        User.hasOne(models.Cart)
    }

    User.beforeUpdate((user) => {
        user.updated_at = new Date();
    })
    return User;
};