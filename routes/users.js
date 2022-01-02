const express = require('express');
const router = express.Router();
const User = require('../models/user');

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

module.exports = router;