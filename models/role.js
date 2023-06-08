module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define('Role', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    Role.associate = function(models) {
        Role.hasMany(models.User);
    }

    Role.beforeUpdate((role) => {
        role.updated_at = new Date();
    });

    return Role;
};