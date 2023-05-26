var express = require('express');
var router = express.Router();
var axios = require('axios');
const db = require('../models');
var crypto = require('crypto');

/* GET users listing. */
router.post('/', async function(req, res, next) {
  //check table if its allready populaed.
  const populated = await db.Item.count()
  if (populated > 0) {
    return res.status(400).json({result: 'Database allready populated'})
  };
  //load data from API and populate as needed
  const response = await axios.get('http://143.42.108.232:8888/items/stock');
  const data = response.data.data;
  //console.log(data);
  const categories = {};
  data.forEach((item) => {
    categories[item.category] = true;
  });
  const categoryName = Object.keys(categories)
  //console.log(categoryName);
  const categoryData = categoryName.map((name) => ({ categoryname: name }));
  const categoryPopulate = await db.Category.bulkCreate(categoryData);
  const itemName = data.map((item) => {
    const catId = categoryPopulate.find((category) => category.categoryname === item.category)
    console.log(categoryPopulate);
    return {
      name: item.item_name,
      price: item.price,
      SKU: item.sku,
      Quantity: item.stock_quantity,
      CategoryId: catId.id
    };
  });
  const itemPopulate = await db.Item.bulkCreate(itemName);
  //return res.json({ result: 'Items populated' });
  const roleName = [
    { name: 'Admin' },
    { name: 'User' }
  ];
  const rolePopulate = await db.Role.bulkCreate(roleName);
  
  const Salt = crypto.randomBytes(16)
  crypto.pbkdf2('P@ssword2023', Salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
  try {
    const adminRole = rolePopulate.find((role) => role.name === 'Admin')
    console.log(rolePopulate);
    const adminName = {
      username: 'Admin',
      encryptedPassword: hashedPassword,
      salt: Salt,
      RoleId: adminRole.id
    };
    await db.User.create(adminName);
    return res.json({ result: 'Admin user populated'});
  } catch (error) {
    next(error);
  }
})
});

module.exports = router;
