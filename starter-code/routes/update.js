const express = require('express');
const router = express.Router()

router.get('/update/:id/edit', (req, res) => {
    const userId = req.params.id;
    User.findById(userId, (err, user) => {
        if (err) { return next(err); }
        res.render('update', { user: user });
    });
})


/* CRUD -> UPDATE DATABASE */
router.post('/update/:id/edit', (req, res) => {
    const userId = req.params.id;
    const {username, imageUrl} = req.body;
    const updates =  {username, imageUrl};

    User.findByIdAndUpdate(userId, updates, (err, product) => {
        if (err) { return next(err); }
        return res.redirect('/');
    });
})
module.exports = router;