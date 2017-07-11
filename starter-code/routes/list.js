var express = require('express');
var router = express.Router();

const User = require('../models/user');

router.get('/list', function(req, res, next) {
   User.find({},(err, users) => {
        if (err) {
            next(err);
        } else {
            res.render('profiles/list', { users });
        }
    });
});

module.exports = router;
