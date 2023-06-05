var express = require('express');
var router = express.Router();
const authAdmin = require('../services/authAdmin');
const db = require('../models');

/* GET home page. */
router.get('/', authAdmin, async function(req, res, next) {
  try {
    const orders = await db.sequelize.query(`
      SELECT orders.id AS orderId, orderitems.quantity AS quantity, items.name AS itemName,
      users.firstname, users.lastname
      FROM orders
      INNER JOIN users ON orders.UserId = users.id
      INNER JOIN orderItems ON orders.id = orderItems.OrderId
      INNER JOIN items ON orderitems.ItemId = items.id
      ORDER BY orders.created_at DESC
    `, { type: db.sequelize.QueryTypes.SELECT });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;