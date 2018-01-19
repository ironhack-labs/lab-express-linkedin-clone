const User = require('../models/user.model');
const moment = require('moment');

module.exports.edit = (req, res, next) => {
  res.send("Estas en profile");
    // const username = req.params.username;
    // User.findOne({ username: req.params.username})
    //     .then(user => {
    //         if (!user) {
    //             next();
    //         } else {
    //             Tweet.find({username: user.username})
    //                 .sort({ createdAt: -1})
    //                 .then(tweets => {
    //                     res.render('profile/show', {
    //                         tweets: tweets,
    //                         user: user,
    //                         moment: moment,
    //                         session: req.session.currentUser,
    //                         following: req.session.currentUser && 
    //                             req.session.currentUser.following.some(f => f == user._id)
    //                     });
    //                 })
    //                 .catch(error => next(error));
    //         }
    //     })
    //     .catch(error => next(error));
};