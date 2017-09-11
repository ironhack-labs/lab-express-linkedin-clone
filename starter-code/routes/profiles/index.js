var express = require('express');
var router = express.Router();
const User = require("../../models/user")


/* GET profile page */ 
router.get('/:userID/', function(req, res, next) {
  User.findById(req.params.userID, (err, user) => {
    if (err) { 
      return next(err) 
    } else {
      res.render('profiles/show', user)
    }
})
})

/* GET profile page edit. */
router.get('/:userID/edit', function(req, res, next) {
  User.findById(req.session.currentUser._id, (err, user) => {
    if (err) { 
      return next(err) 
    } else if (req.session.currentUser._id != req.params.userID) {
      res.render('authentication/login');
    } else {
      res.render('profiles/edit', {
      user: user
  });
}
});
});

/* POST Profile Page Edit */
router.post('/:userID', function(req, res, next) {
  const changeUser =  User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    summary: req.body.summary,
    imageURL: req.body.imageURL,
    company: req.body.company,
    jobTitle: req.body.jobTitle,
    _id: req.session.currentUser._id
  });
    User.findByIdAndUpdate(req.params.userID, changeUser, (err, user) => {
    if (err){ return next(err)}
    res.render('home', {newUser: changeUser});
    

});
});


module.exports = router;
