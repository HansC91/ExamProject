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
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token / Token expired' });
    }
  }

async function authAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ result: "Only Admins can view this endpoint" });
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

    if(req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'Only admins can use this endpoint'})
    }  

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token / Token expired' });
  }
}

async function idCheck(req, res, next) {
  const id = req.params.id
  //to avoid decimal numbers being rounded
  if(isNaN(id) || id.includes('.')) {
    return res.status(409).json({ Conflict: "id is not in correct format, please enter a whole number"});
  }
  next();
}
  
module.exports = authUser;
module.exports = authAdmin;
module.exports = idCheck;
