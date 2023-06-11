class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
    }

    async getAll() {
        return this.Category.findAll({
            where: { }
        })
    }

    async findOne(CategoryId) {
        return this.Category.findOne({
            where: { id: CategoryId }
        })
    }

    async getOneByName(categoryname) {        
        return await this.Category.findOne({
            where: {categoryname: categoryname},
        });
    }

    async create(categoryname) {
        return this.Category.create(
            {
                categoryname: categoryname
            });
    }

    async update(id, categoryname) {
        var datetime = new Date();
        return this.Category.update(
            {
                categoryname: categoryname,
                updated_at: datetime.setHours(datetime.getHours()) 
            }, {
                where: {
                  id: id,
                }
            });
    }

    async deleteItem(id) {
        return this.Category.destroy({
            where: {id: id}
        })
    }

}
module.exports = CategoryService;