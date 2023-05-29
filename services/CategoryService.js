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
        return this.Category.update(
            {
                categoryname: categoryname
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

    /*
    async update(id, name, price, SKU, Quantity, CategoryId) {
        const model = this.Item;
        //so I can set to my timezone when updating.
        var datetime = new Date();
        const result = await model.update({
          name: name,
          price: price,
          SKU: SKU,
          Quantity: Quantity,
          CategoryId: CategoryId,
          updated_at: datetime.setHours(datetime.getHours()+2)
        }, {
          where: {
            id: id,
          }
        });
        return result[0] === 1;
      }

    async deleteItem(id) {
        return this.Item.destroy({
            where: {id: id}
        })
    }*/
}
module.exports = CategoryService;