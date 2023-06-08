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
  if(!categoryName && !SKU && !itemName) {
    return res.status(400).json({ Error: 'Please provide atleast one of SKU, itemName or catergoryName in request body'});
  }
  if(!categoryName && !SKU) {
  let whereItem = await db.Item.findAll ({
    where: {
      name: {
        [Op.like]: `%${itemName}%`
      }
    }
  })
  return res.status(200).json({ searchResult: whereItem});
  } else if (!SKU && !itemName) {
  let whereCategory = await db.Category.findOne({
    where: {
      categoryname: categoryName
    }
  })
  if (whereCategory == null) {
    return res.status(404).json({notFound: `no category named: ${categoryName}`});
  }
  return res.status(200).json({ searchResult: whereCategory});
  } else if (!itemName && !categoryName) {
  let whereSKU = await db.Item.findOne ({
    where: {
      SKU: SKU
    }
  })
  if (whereSKU == null) {
    return res.status(404).json({notFound: `no SKU named: ${SKU}`});
  }
  return res.status(200).json({ searchResult: whereSKU});
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
    return res.status(200).json({ searchResult: whereCombined});
  } else {
    return res.status(404).json({ notFound: `Category ${categoryName} not found` })
  }
}
})

module.exports = router;
