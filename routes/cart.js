var express = require('express');
var router = express.Router();
const db = require('../models');
var CartService = require("../services/CategoryService.js")
var cartService = new CartService(db);
var jwt = require('jsonwebtoken')
const authUser = require('../services/authUser')

/* GET home page. */
router.get('/', authUser, async function(req, res, next) {
  const userId = req.user.id;
  const cartInfo = await db.Cartitem.findAll({
    include: [{
      model: db.Cart,
      where: { UserId: userId }
    }]
  });
  if (cartInfo == 0) {
    return res.status(404).json({notFound: 'You have no items in cart'});
  }
  res.status(200).json({Succesful: cartInfo});
});

router.delete('/:id', authUser, async function(req, res, next) {
  const userId = req.user.id;
  const cartId = req.params.id;
  const cartItems = await db.Cartitem.findAll({
    where: {
      '$Cart.Id$': cartId,
      '$Cart.UserId$': userId
    },
    include: [{
      model: db.Cart,
      where: { UserId: userId},
    }, {
      model: db.Item,
    }],
  });
  console.log(cartItems);

  if ( cartItems == 0) {
    return res.status(404).json({ message: 'Cart items not found'})
  }
  
  for (cartItem of cartItems) {
  await cartItem.destroy();
  }

  return res.status(200).json({ message: 'Cart successfully deleted'});
})

module.exports = router;