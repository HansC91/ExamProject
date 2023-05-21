module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
    });

    Order.associate = function(models) {
        Order.belongsTo(models.User);
    };

    Order.beforeUpdate((cart) => {
        cart.updated_at = new Date();
    });

    return Order;
};