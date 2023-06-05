class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.Item = db.Item;
        this.Cartitem = db.Cartitem;
    }

    async getOne(userId) {
        if (!this.Todo) {
          throw new Error("Todo model not initialized");
        }
        if (!userId) {
          throw new Error("Invalid user ID");
        }
        return this.Cart.findAll({
          where: {UserId: userId},
          include: [{
            model: this.Cartitem,
            attributes: ['price'],
          },
          {
            model: this.Item,
            attributes: ['name']
          },
          ]
        });
      }

}
module.exports = CartService;