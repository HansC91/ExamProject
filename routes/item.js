var express = require('express');
var router = express.Router();
require('dotenv').config()
const db = require('../models');
var ItemService = require("../services/ItemService.js")
var itemService = new ItemService(db);
var CategoryService = require("../services/CategoryService.js")
var categoryService = new CategoryService(db);

/* GET home page. */
router.post('/', async function(req, res, next) {
  const {name, price, SKU, Quantity, CategoryId} = req.body;
  if (!name || !price || !SKU || Quantity === undefined || !CategoryId) {
    return res.status(400).json({ message: 'Please provide an item with all valid fields'});
  }

  itemService.getOneByName(name).then((item) => {
    if (item) {
      return res.status(400).json({ message: 'An item with that name allready exists'})
    } else {
      itemService.create(name, price, SKU, Quantity, CategoryId);
      res.status(200).json({ result: "Item succesfully created and added to database"})
    }
  })
});

router.put('/:id', async function(req, res, next) {
  const id = parseInt(req.params.id);
  if(isNaN(id)) {
    return res.status(400).json({ result: "id is not in correct format"});
  }
  /*const token = req.headers.authorization?.split(' ')[1];
  if(!token) {
    return res.status(400).json({"result": "JWT token not provided"});
  }
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
  if (decodedToken == null) {
    return res.status(400).json({"result": "JWT token is invalid"});
  }*/
  const {name, price, SKU, Quantity, CategoryId} = req.body;
  const validcatid = await categoryService.findOne(CategoryId)
    if(!validcatid) {
      return res.status(400).json({ result: "that CategoryId does not exist"})
  }
  const success = await itemService.update(id, name, price, SKU, Quantity, CategoryId);
  if (!success) {
    return res.status(400).json({ Failure: "Failed to update item"});
  }
  res.status(200).json({ Success: "Item updated successfully"});
});

router.delete('/:id', async function(req, res, next) {
  const id = Number(req.params.id);
    if(isNaN(id)) {
      return res.status(400).json({ result: "id is not in correct format"});
    }
    /*const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
    return res.jsend.fail({"result": "JWT token not provided"});
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET );
    if (decodedToken == null) {
    return res.jsend.fail({"result": "JWT token is invalid"});
    }*/
    //const userId = decodedToken.id;
    const success = await itemService.deleteItem(id)
    if (!success) {
      return res.status(400).json({ Failure: "an Item with that ID does not exist, or has allready been deleted"})
    }
    res.status(200).json({result: "Item successfully deleted"});
})

module.exports = router;


