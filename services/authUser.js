const jwt = require('jsonwebtoken');
const db = require('../models')

async function authUser(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(400).json({ result: "JWT token not provided " });
    }
  
    try {
      const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
      if (!decodedToken) {
        return res.status(400).json({ result: "JWT token is invalid" });
      }
      const user = await db.User.findByPk(decodedToken.id)
      const role = await db.Role.findByPk(user.RoleId)
      
      req.user = {
        id: decodedToken.id,
        role: role.name
      };
  
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token / Token expired' });
    }
    next();
  }

module.exports = authUser;


