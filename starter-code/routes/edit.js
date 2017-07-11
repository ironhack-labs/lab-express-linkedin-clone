const express = require('express');
const User = require('../models/user');

const router  = express.Router();

router.post('/:id', function(req, res, next) {
    const updateUser = {
        name: req.body.name,
        summary: req.body.summary,
        imageUrl: req.body.imageUrl,
        company: req.body.company,
        jobTitle: req.body.jobTitle,
    };

   User.findByIdAndUpdate(req.params.id, updateUser, (err, user) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/list');
        }
    });   
});


router.get('/:id/edit', (req, res, next) => {
     User.findOne({"_id" : req.params.id},(err, user) => {
        if (err) {
            next(err);
        } else {
            if (req.session.currentUser.username !== user.username) {
                res.redirect('/logout');
            } else {
                res.render('profiles/edit', { user });
            }
        }
    });    
});


module.exports = router;
