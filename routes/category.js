var express = require('express');
var router = express.Router();
const db = require('../models');
var CategoryService = require("../services/CategoryService.js")
var categoryService = new CategoryService(db);
const authUser = require('../services/authUser')
const authAdmin = require('../services/authAdmin')
const idCheck = require('../services/idCheck')

/* GET home page. */
router.post('/', authAdmin, async function(req, res, next) {
  const categoryname = req.body.categoryname;
  if (!categoryname || categoryname.length < 2 || categoryname === undefined ) {
    return res.status(400).json({ message: 'Please provide a valid categoryname, minimum 2 characters'});
  }

  categoryService.getOneByName(categoryname).then((category) => {
    if (category) {
      return res.status(400).json({ message: 'A category with that name allready exists'})
    } else {
      categoryService.create(categoryname);
      res.status(200).json({ Successful: "Category succesfully created and added to database"})
    }
  })
});

router.put('/:id', authAdmin, idCheck, async function(req, res, next) {
  const categoryname = req.body.categoryname;
  const id = req.params.id
  const validcatid = await categoryService.findOne(id)
    if(!validcatid) {
      return res.status(404).json({ notFound: "that CategoryId does not exist"})
  }
  const success = await categoryService.update(id, categoryname);
  if (!success) {
    return res.status(400).json({ Failure: "Failed to update category"});
  }
  res.status(200).json({ Success: "Category updated successfully"});
});

router.delete('/:id',authAdmin, idCheck, async function(req, res, next) {
  const id = Number(req.params.id);
  const success = await categoryService.deleteItem(id)
  if (!success) {
    return res.status(404).json({ notFound: "a category with that ID does not exist, or has allready been deleted"})
  }
  res.status(200).json({result: "Category successfully deleted"});
})

module.exports = router;