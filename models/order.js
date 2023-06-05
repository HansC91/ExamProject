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
        status: {
            type: Sequelize.STRING,
            defaultValue: 'In process',
        }
    }, {
        timestamps: false
    });

    Order.associate = function(models) {
        Order.belongsTo(models.User);
        Order.hasMany(models.Orderitem);
    };

    Order.beforeUpdate((cart) => {
        cart.updated_at = new Date();
    });

    return Order;
};