var express = require('express');
var router = express.Router();
const db = require('../models');
const authGuest = require('../services/authGuest');
const { Op } = require('sequelize');

/* GET home page. */
router.get('/items', authGuest, async function(req, res, next) {
  try {
    const { user } = req;
    const items = await db.Item.findAll({
      attributes: ['id','name', 'price', 'SKU', 'Quantity', 'created_at', 'updated_at', 'CategoryId'],
      include: {
        model: db.Category,
        attributes: ['categoryname'],
        required: true
      }
    });

    items.sort((a,b) => a.CategoryId - b.CategoryId);

    const filteredItems = items.map(item => {
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        SKU: item.SKU,
        quantity: item.Quantity,
        created_at: item.created_at,
        updated_at: item.updated_at,
        categoryId: item.CategoryId,
        categoryname: item.Category.categoryname
      };
    });
    if(user) {
    
    res.status(200).json(filteredItems);
  } else {
    guestFilteredItems = filteredItems.filter(item => item.quantity > 0)
    res.status(200).json(guestFilteredItems)
  }
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

module.exports = router;