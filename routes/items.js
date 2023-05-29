var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/items', async function(req, res, next) {
  try {
    const items = await db.Item.findAll({
      attributes: ['id','name', 'price', 'SKU', 'Quantity', 'created_at', 'updated_at', 'CategoryId'],
      include: {
        model: db.Category,
        attributes: ['categoryname'],
        required: true
      }
    });
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
    res.status(200).json(filteredItems);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;