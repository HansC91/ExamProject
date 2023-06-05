var express = require('express');
var router = express.Router();
const db = require('../models');

/* GET home page. */
router.get('/categories', async function(req, res, next) {
  try {
    const categories = await db.Category.findAll({
      attributes: ['id','categoryname', 'created_at', 'updated_at'],
      });
    const filteredCategories = categories.map(category => {
      return {
        id: category.id,
        categoryname: category.categoryname,
        created_at: category.created_at,
        updated_at: category.updated_at 
      };
    });
    res.status(200).json(filteredCategories);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal server error');
  }
});

module.exports = router;