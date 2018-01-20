const mongoose = require('mongoose');
const Post = require('../models/post.model');

module.exports.index = (req, res, next) => {
    Post.find()
        .sort({
            createdAt: -1
        })
        .then((posts) => {
            res.render('index', {
                posts: posts
            });
        })
        .catch(error => next(error));
};