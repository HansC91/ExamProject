module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define('Cart', {
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
    }, {
        timestamps: false
    });

    Cart.associate = function(models) {
        Cart.belongsTo(models.User);
    };

    Cart.beforeUpdate((cart) => {
        cart.updated_at = new Date();
    });

    return Cart;
};