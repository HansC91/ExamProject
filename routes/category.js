var express = require('express');
var router = express.Router();
const db = require('../models');
//var ItemService = require("../services/ItemService.js")
//var itemService = new ItemService(db);
var CategoryService = require("../services/CategoryService.js")
var categoryService = new CategoryService(db);

/* GET home page. */
router.post('/', async function(req, res, next) {
  const categoryname = req.body.categoryname;
  if (!categoryname || categoryname.length < 2 || categoryname === undefined ) {
    return res.status(400).json({ message: 'Please provide a valid categoryname, minimum 2 characters'});
  }

  categoryService.getOneByName(categoryname).then((category) => {
    if (category) {
      return res.status(400).json({ message: 'A category with that name allready exists'})
    } else {
      categoryService.create(categoryname);
      res.status(200).json({ result: "Item succesfully created and added to database"})
    }
  })
});

router.put('/:id', async function(req, res, next) {
  const id = Number(req.params.id);
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
  const categoryname = req.body.categoryname;
  const validcatid = await categoryService.findOne(id)
    if(!validcatid) {
      return res.status(400).json({ result: "that CategoryId does not exist"})
  }
  const success = await categoryService.update(id, categoryname);
  if (!success) {
    return res.status(400).json({ Failure: "Failed to update category"});
  }
  res.status(200).json({ Success: "Category updated successfully"});
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
    const success = await categoryService.deleteItem(id)
    if (!success) {
      return res.status(400).json({ Failure: "a category with that ID does not exist, or has allready been deleted"})
    }
    res.status(200).json({result: "Category successfully deleted"});
})

module.exports = router;