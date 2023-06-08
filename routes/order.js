var express = require('express');
var router = express.Router();
const db = require('../models');
const  authUser = require('../services/authUser');
const  authAdmin = require('../services/authAdmin');
var UserService = require("../services/UserService.js")
var userService = new UserService(db);



router.post('/:id', authUser, async function(req, res, next) {
  const itemId = req.params.id;
  const userId = req.user.id;
  try {
    const [order, created] = await db.Order.findOrCreate({
      where: { UserId: userId, status: 'In process' },
      defaults: { UserId: userId },
    });
    const cartItem = await db.Cartitem.findOne({
      where: {
        Itemid: itemId,
        '$Cart.UserId$': req.user.id,
      },
      include: [{
        model: db.Cart,
        as: 'Cart',
      }, {
        model: db.Item,
      }]
    });
    if (!cartItem) {
      return res.status(400).json({ message: 'Cart item not found'});
    }
    const item = await db.Item.findByPk(itemId);
    if (!item) {
      return res.status(400).json({ message: 'Item not found'});
    }
    if (item.Quantity < cartItem.quantity) {
      return res.status(400).json({ message: `Not enough stock quantity, only ${item.Quantity} left`})
    }
    let user = await userService.getOneById(userId);

    var emailAccounts = await userService.getAllEmail(user.email);
    var discount = 1;
    if (emailAccounts.length == 2) {
      discount = 0.9;
    } else if (emailAccounts.length == 3) {
      discount = 0.7
    } else if (emailAccounts.length == 4) {
      discount = 0.6;
    }

    const totalPrice = (item.price * cartItem.quantity) * discount
    const transaction = await db.sequelize.transaction();
    try {
      await db.Item.update({ Quantity: item.Quantity - cartItem.quantity },  { where: { id: itemId }, transaction });
      const orderItem = await db.Orderitem.create({
        ItemId: itemId,
        OrderId: order.id,
        quantity: cartItem.quantity,
        price: totalPrice,
      }, {transaction });
      await db.Order.update({ total: db.sequelize.literal(`total + ${totalPrice}`) }, { where: { id: order.id }, transaction });
      await db.Cartitem.destroy({ where: { id: cartItem.id }, transaction});
      await transaction.commit();
      return res.status(200).json({ result: 'Order created successfully' });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({ error: 'Internal server error'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error2'});
  } 
});

router.put('/:id', authAdmin, async function(req, res, next) {
  const orderId = req.params.id;
  const status = req.body.status;
  if (status !== 'In process' && status !== 'Complete' && status !== 'Cancelled')
    return res.status(400).json({ message: 'Status in body needs to be either In process, Complete or Cancelled'});

  try {
    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return res.status(400).json({ message: 'Order not found'});
    }

    await db.Order.update({ status }, { where: { id: orderId } });
    return res.status(200).json({ message: 'Order status successfully updated' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'internal server error'});
  }
})

module.exports = router;