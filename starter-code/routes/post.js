const express = require('express');
const router = express.Router();
const path = require('path');
const debug = require('debug')(`linkedin:${path.basename(__filename).split('.')[0]}`);
const User = require('../models/User');
const Post = require('../models/Post');


/* RENDER NEW POST FORM */
router.get('/:userId/new', (req, res, next) => {
    if (req.session.currentUser != null) {
        const userId = req.params.userId;
        const userName = req.session.currentUser.username;
        console.log(req);
        res.render('post', {
            title: "Post",
            userId: userId,
            userName:userName
        });    
    } else {
        res.redirect('/');
    }
    
});


/* CRUD -> CREATE POST */
router.post('/:userId/new', (req, res) => {
    const {
        content,
        creatorId,
        creatorName
    } = req.body;
    const newPost = new Post({
        content,
        creatorId,
        creatorName
    });
    console.log(newPost);
    newPost.save(err => {
        if (err) {
            return next(err)
        }
        res.redirect('/');
    })
});


/* CRUD -> UPDATE POST GET FORM*/
router.get('/edit/:postId', (req, res) => {
    const postId = req.params.postId;
    Post.findById(postId, (err, post) => {
        if (err) {
            return next(err);
        }
        res.render('edit-post', {
            post: post
        });
    }); 
})

/* CRUD -> UPDATE POST POST FORM to db */
router.post('/edit/:postId', (req, res) => {
    const postId = req.params.postId;
    const {
        content,
        creatorId,
        creatorName
    } = req.body;

    const updates = {content};

    Post.findByIdAndUpdate(postId, updates, (err, product) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/');
    });
})




module.exports = router;