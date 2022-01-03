const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');
const multer = require('multer');

// Set Storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage,}).single('image');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function (err, userList) {
    if (err) console.error(err);
    console.log(userList);
    res.render('users', { userList: userList, current_user: req.user });
  });
});

/* POST send friend request */
router.post('/send_friend_request/:_id', function(req, res, next) {
  User.findById(req.params._id, function(err, receive_user) {
    if (err) console.error(err);
    const addReceivedList = receive_user.invite_received;
    addReceivedList.push(req.user._id);
    receive_user.invite_received = addReceivedList;
    receive_user.save(function(err) {
      if (err) console.error(err);
      User.findById(req.user._id, function(err, sent_user) {
        const addInviteList = sent_user.invite_sent;
        addInviteList.push(req.params._id);
        sent_user.invite_sent = addInviteList;
        sent_user.save(function(err) {
          if (err) console.error(err);
          res.redirect('/users');
        });
      });
    })
  });
});

/* POST accept friend request */
router.post('/accept_friend_request/:_id', function(req, res, next) {
  User.findById(req.params._id, function(err, sent_user) {
    if (err) console.error(err);
    const updateSentList = sent_user.invite_sent;
    updateSentList.splice(updateSentList.findIndex((invite_sent_id) => invite_sent_id.toString() === req.user._id.toString(0)), 1);
    sent_user.invite_sent = updateSentList;
    const updateSentUserFriendsList = sent_user.friends;
    updateSentUserFriendsList.push(req.user._id);
    sent_user.friends = updateSentUserFriendsList;
    sent_user.save(function(err) {
      if (err) console.error(err);
      User.findById(req.user._id, function(err, receive_user) {
        const updateReceivedList = receive_user.invite_received;
        updateReceivedList.splice(updateReceivedList.findIndex((invite_request_id) => invite_request_id.toString() === req.params._id.toString(0)), 1);
        receive_user.invite_received = updateReceivedList;
        const updateReceiveUserFriendsList = receive_user.friends;
        updateReceiveUserFriendsList.push(req.params._id);
        receive_user.friends = updateReceiveUserFriendsList;
        receive_user.save(function(err) {
          if (err) console.error(err);
          res.redirect('/users');
        });
      });
    });
  });
});

/* POST reject friend request */
router.post('/reject_friend_request/:_id', function(req, res, next) {
  User.findById(req.params._id, function(err, sent_user) {
    if (err) console.error(err);
    const updateSentList = sent_user.invite_sent;
    updateSentList.splice(updateSentList.findIndex((invite_sent_id) => invite_sent_id.toString() === req.user._id.toString(0)), 1);
    sent_user.invite_sent = updateSentList;
    sent_user.save(function(err) {
      if (err) console.error(err);
      User.findById(req.user._id, function(err, receive_user) {
        const updateReceivedList = receive_user.invite_received;
        updateReceivedList.splice(updateReceivedList.findIndex((invite_request_id) => invite_request_id.toString() === req.params._id.toString(0)), 1);
        receive_user.invite_received = updateReceivedList;
        receive_user.save(function(err) {
          if (err) console.error(err);
          res.redirect('/users');
        });
      });
    });
  });
});

/* GET user profile page */
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) console.error(err);
    if (user._id.toString() !== req.user._id.toString()) res.redirect('/posts');
    else {
      Post.find({author_id: req.user._id}, function(err, posts) {
        if (err) console.error(err);
        res.render('profile', { postsList: posts, current_user: req.user });
      });
    }
  });
});

/* PUT update user profile */
router.put('/:id', function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, {
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email
  }, function (err, user) {
    if (err) console.error(err);
    res.redirect('/users/' + req.user._id);
  })
})

router.post('/:id/add_image', function(req, res, next) {
  upload(req, res, (err) => {
    if (err) res.redirect('/users/' + req.user._id);
    else if (req.file === undefined) {
      res.redirect('/users/' + req.user._id);
    }
    else {
      User.findByIdAndUpdate(req.params.id, {profile_image: req.file}, function(err, result) {
        if (err) console.log(err);
        res.redirect('/users/' + req.user._id);
      });
    }
  });
});

module.exports = router;