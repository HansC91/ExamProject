var express = require('express');
var router = express.Router();
const authAdmin = require('../services/authAdmin');
const db = require('../models');

/* GET home page. */
router.get('/', authAdmin, async function(req, res, next) {
  try {
    const carts = await db.sequelize.query(`
      SELECT carts.id AS cartId, cartitems.quantity AS quantity, items.name AS itemName, items.id AS itemId,
      users.firstname, users.lastname
      FROM carts
      INNER JOIN users ON carts.UserId = users.id
      INNER JOIN cartItems ON carts.id = cartItems.cartId
      INNER JOIN items ON cartitems.ItemId = items.id
      ORDER BY carts.created_at DESC
    `, { type: db.sequelize.QueryTypes.SELECT });

    return res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;