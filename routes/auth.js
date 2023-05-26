// API CA
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
    return res.status(404).json({ message: 'Please provide both username and password'});
  }

  userService.getOneByName(username).then((user) => {
    if (!user) {
      return res.status(404).json({ message: 'No user with that username exists.' });
    }
    
    crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      if (hashedPassword.length !== user.encryptedPassword.length || !crypto.timingSafeEqual(user.encryptedPassword, hashedPassword)) {
        
        return res.status(401).json({ message: 'Incorrect login details'});
      }

      const token = jwt.sign({ username: username.id, id: user.id }, process.env.TOKEN_SECRET, { expiresIn: "2h" });
      res.cookie('jwt', token);

      res.status(200).json({ "result": 'You are logged in', id: user.id, username: user.username, token: token});
    });  
  }).catch((err) => {
    return next(err);
  });
});


router.post('/signup', jsonParser, async (req, res, next) => {
  const {name, email, password } = req.body;
  if (name == null) {
    return res.jsend.fail({ name: "Must fill in name"});
  }
  if (email == null) {
    return res.jsend.fail({ email: "Must fill in email"});
  }
  if (password == null) {
    return res.jsend.fail({ password: "Must enter password"});
  }
  var user = await userService.getOneByName(email);
  if (user != null) {
    return res.jsend.fail({ email: "Email allready in use"});
  }
  var salt = crypto.randomBytes(16);
  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    try {
      await userService.create(name, email, hashedPassword, salt);
      res.jsend.success({ result: "Account created succesfully"});
    } catch (error) {
      next(error);
    }
  })
})

module.exports = router;