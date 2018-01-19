const User = require('../models/user.model');
const Post = require('../models/post.model');
const moment = require('moment');


module.exports.new = (req, res, next) => {
  console.log(req.params.userId);
  console.log(req.session.currentUser._id);
  
  if (req.params.userId != req.session.currentUser._id) {
    res.redirect("/");
  } else{
    res.render('posts/new',{email:req.session.currentUser.email});
  }
};

// module.exports.create = (req, res, next) => {
//   if (req.params.userId != req.session.currentUser._id) {
//     res.redirect("/");
//   } else {
//     user = new User(req.body);
//     user.save()
//       .then(() => {
//         console.log("User created");
//         console.log(user);
//         req.session.currentUser = user;
//         res.render('auth/signok', user);
//         //   res.send('/signok');
//       }).catch(error => {
//         if (error instanceof mongoose.Error.ValidationError) {
//           res.render('posts/new',{
//             user: user,
//             error: error.errors
//           });
//         } else {
//           next(error);
//         }
//       });

//   }
// };