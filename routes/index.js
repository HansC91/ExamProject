var express = require('express');
var router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/search', async function(req, res,next) {
  const { itemName, categoryName, SKU } = req.body;

  if(!categoryName && !SKU) {
  let whereItem = await db.Item.findAll ({
    where: {
      name: {
        [Op.like]: `%${itemName}%`
      }
    }
  })
  return res.status(200).json({ message1: whereItem});
  } else if (!SKU && !itemName) {
  let whereCategory = await db.Category.findOne({
    where: {
      categoryname: categoryName
    }
  })
  return res.status(200).json({ message2: whereCategory});
  } else if (!itemName && !categoryName) {
  let whereSKU = await db.Item.findOne ({
    where: {
      SKU: SKU
    }
  })
  return res.status(200).json({ message3: whereSKU});
  } else if (itemName && categoryName) {
    const category = await db.Category.findOne({
      where: {
        categoryname: categoryName
      }
    });
    if (category) {
    let whereCombined = await db.Item.findAll({
      where: {
        name: {
          [Op.like]: `%${itemName}%`
        },
        CategoryId: category.id
      }
    })
    return res.status(200).json({ message4: whereCombined});
  } else {
    return res.status(404).json({ message: `Category ${categoryName} not found` })
  }
}
})

module.exports = router;
