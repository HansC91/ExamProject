module.exports = (sequelize, Sequelize) => {
    const Orderitem = sequelize.define('Orderitem', {
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

    Orderitem.associate = function(models) {
        Orderitem.belongsTo(models.Order);
    };

    Orderitem.associate = function(models) {
        Orderitem.belongsTo(models.Item);
    }

    Orderitem.beforeUpdate((orderitem) => {
        orderitem.updated_at = new Date();
    });

    return Orderitem;
};