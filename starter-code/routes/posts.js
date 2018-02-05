const express = require('express');
const router = express.Router();
const Post = require('../models/posts');

router.get('/users/:userId/posts', (req, res, next) => {
    Post.find({
        _creator: req.params.userId
    }, (err, posts) => {
        if (err) {
            return next(err);
        }
        return res.render('posts/index', {
            title: "Post page",
            loggedIn: req.session.currentUser !== undefined,
            posts: posts,
            userId: req.params.userId
        });
    });
});
router.get('/newpost', (req, res, next) => {
    if (!req.session.currentUser) {
        return res.redirect('/');
    }
    return res.render('posts/newpost', {
        title: "New post page",
        loggedIn: req.session.currentUser !== undefined,
        userId: req.session.currentUser._id
    });
});
router.get('/users/:userId/posts/:postId', (req, res, next) => {
    Post.findOne({
        _id: req.params.postId
    }, (err, post) => {
        if (err) {
            return next(err);
        }
        return res.render('posts/post', {
            title: "Post page",
            loggedIn: req.session.currentUser !== undefined,
            post: post,
            userId: req.params.userId
        });
    });

});
router.post('/users/:userId/posts/:postId', (req, res, next) => {
    Post.findOne({
        _id: req.params.postId
    }, (err, post) => {
        if (err) {
            return next(err);
        }
        post.content = req.body.content;
        post.save((err) => {
            if (err) {
                return next(err);
            }
            return res.redirect('/users/' + req.params.userId + '/posts');
        });
    });

});

router.post('/users/:userId/posts', (req, res, next) => {
    const newPost = new Post({
        content: req.body.content,
        _creator: req.params.userId
    });

    newPost.save((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/users/' + req.params.userId + '/posts');
    });
});

module.exports = router;