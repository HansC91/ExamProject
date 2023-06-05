const db = require('../models');

beforeAll(async () => {
  await db.sequelize.sync();
});


afterAll(async () => {
  await db.sequelize.close();
});