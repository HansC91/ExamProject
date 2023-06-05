var express = require('express');
var router = express.Router();
const db = require('../models');
const authUser = require('../services/authUser');

/* GET home page. */
router.get('/', authUser, async function(req, res, next) {
  const userRole = req.user.role;
  const userId = req.user.id;
  let orders;
  if (userRole == 'Admin') {
    orders = await db.Order.findAll({
      include: [{
        model: db.Orderitem,
        include: {
          model: db.Item
        },
      }, {
        model: db.User
      }],
    });
  } else {
    orders = await db.Order.findAll({
      where: {UserId: userId},
      include: [{
        model: db.Orderitem,
        include: {
          model: db.Item,
        },
      }, {
        model: db.User,
      }],
    });
  }
  return res.status(200).json({ orders })
});

module.exports = router;

