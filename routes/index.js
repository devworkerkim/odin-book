const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Odin-Book' });
});

router.post('/', function (req, res, next) {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err || !user) {
        return res.status(400).json({
            message: 'Something is not right',
            user : user
        });
    }
    req.login(user, {session: false}, (err) => {
      if (err) res.send(err); 
      jwt.sign(user.toJSON(), process.env.TOKEN_SECRET, {expiresIn: 300}, function (err, token) {
        return res.cookie('jwt', token).redirect('/home');
      });
    });
  })(req, res);
});

router.get('/logout', function(req, res) {
  res.clearCookie('jwt').redirect('/');
})

router.get('/home', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  res.render('home');
})
module.exports = router;
