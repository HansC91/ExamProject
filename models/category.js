module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define('Category', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        categoryname: {
            type: Sequelize.STRING,
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
    Category.associate = function(models) {
        Category.hasMany(models.Item)
    }

    Category.beforeUpdate((category) => {
        category.updated_at = new Date();
    });

    return Category;
};