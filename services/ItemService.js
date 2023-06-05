class ItemService {
    constructor(db) {
        this.client = db.sequelize;
        this.Item = db.Item;
    }

    async create(name, price, SKU, Quantity, CategoryId) {
        return this.Item.create(
            {
                name: name,
                price: price,
                SKU: SKU,
                Quantity: Quantity,
                CategoryId: CategoryId
            });
    }

    async getAll() {
        return this.Item.findAll({
            where: { }
        })
    }

    async getAllEmail(email) {
        return this.Item.findAll({
            where: {email: email}
        })
    }

    async getOneByName(name) {        
        return await this.Item.findOne({
            where: {name: name},
        });
    }

    async getOneBySKU(SKU) {        
        return await this.Item.findOne({
            where: {SKU: SKU},
        });
    }

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
    }
}
module.exports = ItemService;