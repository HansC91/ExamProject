const jwt = require('jsonwebtoken');
const db = require('../models')

async function authGuest(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        if (!decodedToken) {
            return res.status(403).json({ result: "JWT token is invalid" });
        }
        const user = await db.User.findByPk(decodedToken.id)   
        req.user = user;
        next();
    } else {
        req.user = null;
        next();
    }
}
  module.exports = authGuest;