const express = require('express');
const User = require('../models/user');

const router  = express.Router();

router.get('/:id', function(req, res, next) {
    User.findOne({"_id" : req.params.id},(err, user) => {
        let currentUser = req.session.currentUser;
        if (err) {
            next(err);
        } else {
            res.render('profiles/show', { user,  currentUser });
        }
    });   
});

module.exports = router;
