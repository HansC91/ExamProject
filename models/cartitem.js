module.exports = (sequelize, Sequelize) => {
    const Cartitem = sequelize.define('Cartitem', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: Sequelize.INTEGER,
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

    Cartitem.associate = function(models) {
        Cartitem.belongsTo(models.Cart);
    };

    Cartitem.associate = function(models) {
        Cartitem.belongsTo(models.Item);
    }

    Cartitem.beforeUpdate((cartitem) => {
        cartitem.updated_at = new Date();
    });

    return Cartitem;
};