var express = require('express');
var router = express.Router();
const db = require('../models');
var CartService = require("../services/CategoryService.js")
var cartService = new CartService(db);
var jwt = require('jsonwebtoken')
const authUser = require('../services/authUser');

/* GET home page. */
router.post('/', authUser, async function(req, res, next) {
  const userId = req.user.id;
  const { itemId, quantity } = req.body;
  if (!itemId || !quantity) {
    return res.status(404).json({notFound : "Both itemId and quanity needs to be sent in the request body"});
  }
  const [cart, created] = await db.Cart.findOrCreate({
    where: { UserId: userId},
    defaults: { UserId: userId}
  }); 
  const item = await db.Item.findOne({ where: { id: itemId} });
  if (!item) {
    return res.status(404).json({notFound : "There is no item with ItemId: " + itemId});
  }
  if (isNaN(quantity)) {
    return res.status(400).json({Error: "Quantity needs to be a number"})
  }
  if (item.Quantity < quantity) {
    return res.status(400).json({Error: "There is not enough item in stock, you can order maximum: " + item.Quantity});
  }
  const itemInCart = await db.Cartitem.findOne({
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
  if (itemInCart) {
    itemInCart.quantity += quantity;
    if (itemInCart.Item.Quantity < quantity) {
      return res.status(400).json({ message: 'Not enough stock'})
    }
    await itemInCart.save();
    return res.status(200).json({ Succesful: "Item quantity updated in the existing cartitem"})
  }
  const cartItem = await db.Cartitem.create({
    CartId: cart.id,
    ItemId: item.id,
    quantity: quantity,
    price: item.price,
  });
  res.status(200).json({"Cart": cartItem});
});

router.put('/:id', authUser, async function(req, res, next) {
  const userId = req.user.id;
  const itemId = req.params.id;
  const newQuantity = req.body.quantity;
  try {
    const cartItems = await db.Cartitem.findOne({
      where: {
        ItemId: itemId,
      },
      include: [{
        model: db.Cart,
        where: { UserId: userId},
      }, {
        model: db.Item,
      }],
    });

    if (!cartItems || !cartItems.Cart) {
      return res.status(404).json({ message: 'Cart item not found'})
    }
    if (isNaN(newQuantity)) {
      return res.status(400).json({ message: 'Quantity must be a number' })
    }
    if (cartItems.Item.Quantity < newQuantity) {
      return res.status(400).json({ message: 'Not enough stock'})
    }

    cartItems.quantity = newQuantity;
    await cartItems.save()
    return res.status(200).json({ message: 'Cart item successfully updated'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error'});
  }
});

router.delete('/:id', authUser, async function(req, res, next) {
  const userId = req.user.id;
  const itemId = req.params.id;
    const cartItems = await db.Cartitem.findOne({
      where: {
        ItemId: itemId,
      },
      include: [{
        model: db.Cart,
        where: { UserId: userId},
      }, {
        model: db.Item,
      }],
    });

    if (!cartItems || !cartItems.Cart) {
      return res.status(404).json({ message: 'Cart item not found'})
    }
  
    await cartItems.destroy()
    return res.status(200).json({ message: 'Cart item successfully deleted'});
})

module.exports = router;