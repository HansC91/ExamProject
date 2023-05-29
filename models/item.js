module.exports = (sequelize, Sequelize) => {
    const Item = sequelize.define('Item', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        price: {
            type: Sequelize.DECIMAL,
            allowNull: false
        },
        SKU: {
            type: Sequelize.STRING,
            allowNull: false
        },
        Quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
    Item.associate = function(models) {
        Item.belongsTo(models.Category);
    };

    Item.beforeUpdate((item) => {
        item.updated_at = new Date();
    });
    return Item;
};