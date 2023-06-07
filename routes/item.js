var express = require('express');
var router = express.Router();
require('dotenv').config()
const db = require('../models');
var ItemService = require("../services/ItemService.js")
var itemService = new ItemService(db);
var CategoryService = require("../services/CategoryService.js")
var categoryService = new CategoryService(db);
const authAdmin = require('../services/authAdmin')
const idCheck = require('../services/idCheck')

/* GET home page. */
router.post('/', authAdmin, async function(req, res, next) {
  const {name, price, SKU, Quantity, CategoryId} = req.body;
  if (!name || typeof price !== 'number' || !SKU || !Number.isInteger(Quantity) || !Number.isInteger(CategoryId)) {
    return res.status(409).json({ Conflict: 'Please provide an item with all valid fields'});
  }

  itemService.getOneByName(name).then((item) => {
    if (item) {
      return res.status(409).json({ Conflict: 'An item with that name allready exists'})
    } else {
      itemService.getOneBySKU(SKU).then((sku) => {
        if(sku) {
          return res.status(409).json({ Conflict: 'An item with that SKU allready exists'})
        } else {
          categoryService.findOne(CategoryId).then((catId) => {
            if(!catId) {
              return res.status(404).json({ notFound: 'There is no Category with ID: ' + CategoryId})
            }
            itemService.create(name, price, SKU, Quantity, CategoryId);
            res.status(200).json({ Succesful: "Item succesfully created and added to database"})
          })
        }
      })
    }
  })
});

router.put('/:id', authAdmin, idCheck, async function(req, res, next) {
  const id = req.params.id
  const itemExists = await db.Item.findByPk(id)
  if (!itemExists) {
    return res.status(404).json({ notFound: 'An item with that ID does not exist'});
  }
  const {name, price, SKU, Quantity, CategoryId} = req.body;
  if (!name || typeof price !== 'number' || !SKU || !Number.isInteger(Quantity) || !Number.isInteger(CategoryId)) {
    return res.status(409).json({ Conflict: 'Please provide an item with all valid fields'});
  }
  const validcatid = await categoryService.findOne(CategoryId)
    if(!validcatid) {
      return res.status(404).json({ notFound: "that CategoryId does not exist"})
  }
  const success = await itemService.update(id, name, price, SKU, Quantity, CategoryId);
  if (!success) {
    return res.status(400).json({ badRequest: "Failed to update item"});
  }
  res.status(200).json({ Success: "Item updated successfully"});
});

router.delete('/:id', authAdmin, idCheck, async function(req, res, next) {
  const id = req.params.id
  const success = await itemService.deleteItem(id)
  if (!success) {
    return res.status(404).json({ notFound: "an Item with that ID does not exist, or has allready been deleted"})
  }
  res.status(200).json({Succesful: "Item successfully deleted"});
})

module.exports = router;


