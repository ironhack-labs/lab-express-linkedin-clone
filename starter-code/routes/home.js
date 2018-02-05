const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');

router.get('/', function(req, res, next) {
    Post.find().exec((err, posts) => {
        res.render('index', {
            posts: posts,
            title: 'Home'
        });
    });
});

/* router.get('/private', function(req, res, next) {
    if(req.session.currentUser){
        res.render('private', { title: 'Private' });
    }
    res.redirect('http://disney.com');
}); */

module.exports = router;