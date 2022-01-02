const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/post');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Post.find({}, function (err, postsList) {
    if (err) console.error(err);
    res.render('posts', { postsList: postsList, current_user: req.user });
  });
});

/* GET create post page */
router.get('/create_post', function(req, res, next) {
    res.render('createPost');
})

/* POST create post */
router.post('/create_post', function(req, res, next) {
    const newPost = new Post({
        author_id: req.user._id,
        author_firstname: req.user.first_name,
        author_lastname: req.user.last_name,
        body: req.body.body,
    });
    newPost.save(function (err, post) {
        if (err) console.error(err);
        res.redirect('/posts');
    });
});

/* GET edit post page */
router.get('/:postid', function(req, res, next) {
    Post.findById(req.params.postid, function (err, post) {
        if (err) console.error(err);
        if (post.author_id.toString() !== req.user._id.toString()) res.redirect('/posts');
        else res.render('singlepost', {post: post});
    });
});

/* PUT update post */
router.put('/:postid', function(req, res, next) {
    Post.findByIdAndUpdate(req.params.postid, {body: req.body.body}, function (err, post) {
        if (err) console.error(err);
        if (post.author_id.toString() !== req.user._id.toString()) res.redirect('/posts');
        else res.redirect('/posts');
    });
});

/* DELETE delete post */
router.delete('/:postid', function(req, res, next) {
    Post.findByIdAndDelete(req.params.postid, {}, function (err, post) {
        if (err) console.error(err);
        if (post.author_id.toString() !== req.user._id.toString()) res.redirect('/posts');
        else res.redirect('/posts');
    });
});

/* PUT like post */
router.put('/:postid/like', function(req, res, next) {
    Post.findById(req.params.postid, function(err, post) {
        if (err) console.error(err);
        const newLikeList = post.likes;
        newLikeList.push(req.user._id);
        post.likes = newLikeList;
        post.save(function(err) {
            if (err) console.error(err);
            res.redirect('/posts');
        });
    });
});

/* PUT unlike post */
router.put('/:postid/unlike', function(req, res, next) {
    Post.findById(req.params.postid, function(err, post) {
        if (err) console.error(err);
        const newLikeList = post.likes;
        newLikeList.splice(newLikeList.findIndex((userid) => userid.toString() === req.user._id.toString()), 1);
        post.likes = newLikeList;
        post.save(function(err) {
            if (err) console.error(err);
            res.redirect('/posts');
        });
    });
});

module.exports = router;