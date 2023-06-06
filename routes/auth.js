var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
require('dotenv').config()
var jwt = require('jsonwebtoken')
const db = require('../models');
var UserService = require("../services/UserService.js")
var userService = new UserService(db);

passport.use(new LocalStrategy(function verify(email, password, cb) {
  userService.getOneByName(email).then((data) => {
    if(data === null) {
      return cb(null, false, { message: 'Incorrect email or password.' });
    }
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(data.encryptedPassword, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }
      return cb(null, data);
    }); 
    console.log(data);
  });
}));


passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


router.post('/login', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password ) {
    return res.status(401).json({ Unauthorized: 'Please provide both username and password'});
  }

  userService.getOneByName(username).then((user) => {
    if (!user) {
      return res.status(401).json({ Unauthorized: 'No user with that username exists.' });
    }
    
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      if (hashedPassword.length !== user.encryptedPassword.length || !crypto.timingSafeEqual(user.encryptedPassword, hashedPassword)) {
        
        return res.status(401).json({ Unauthorized: 'Incorrect login details'});
      }

      const token = jwt.sign({ username: username.id, id: user.id }, process.env.TOKEN_SECRET, { expiresIn: "2h" });
      res.cookie('jwt', token);

      res.status(200).json({ Successful: 'You are logged in', id: user.id, username: user.username, token: token});
    });  
  }).catch((err) => {
    return next(err);
  });
});


router.post('/signup', async (req, res, next) => {
  const {username, firstname, lastname, email, password} = req.body;
  if (!username || !email) {
    return res.status(409).json({ Conflict: "Username and email needs to be filled in"});
  }
  if (!firstname || !lastname) {
    return res.status(409).json({ Conflict: 'Please enter first- and lastname'});
  }
  if (!password || password.length < 6 ) {
    return res.status(409).json({ Conflict: "Must enter password of 6 characters or longer"});
  }
  var uniqueUsername = await userService.getOneByName(username);
  if (uniqueUsername !== null && username === uniqueUsername.username) {
    return res.status(409).json({ Conflict: "Username allready in use, try another one"})
  }

  var emailAccounts = await userService.getAllEmail(email);
  var count = 0;
  
  for (var i = 0; i < emailAccounts.length; i++) {
    if(emailAccounts[i].email === email) {
      count++;
    }
  }
  if (count >= 4) {
    return res.status(409).json({ Conflict: "Email allready in use on 4 family members"});
  }
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      await userService.create(username, firstname, lastname, email, hashedPassword, salt);
      res.status(200).json({ Successful: "Account created succesfully"});
    } catch (error) {
      next(error);
    }
  })
})

module.exports = router;