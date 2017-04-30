const User = require('../models/user');

const userController = {};

// Show LIST of profiles function
userController.list = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      console.log('Error:', err);
    } else {
      res.render('../views/profiles/index', { users });
    }
  });
};

// SHOW single profile by id function
userController.show = (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('../views/profiles/show', { user });
    }
  });
};

// CREATE profile function, it just redirects to create the page
userController.create = (req, res) => {
  res.render('../views/profiles/create');
};

// SAVE new profile function
userController.save = (req, res) => {
  const user = new User(req.body);

  User.save((err) => {
    if (err) {
      console.log(err);
      res.render('../views/profiles/create');
    } else {
      console.log('Successfully created a profile.');
      res.redirect(`/profiles/show/${user._id}`);
    }
  });
};

// EDIT profile by id function, it just redirects to edit page
userController.edit = (req, res) => {
  User.findOne({ _id: req.params.id }).exec((err, user) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      res.render('../views/profiles/edit', { user });
    }
  });
};

// UPDATE user function for updating currently edited user
userController.update = (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      summary: req.body.summary,
      imageUrl: req.body.imageUrl,
      company: req.body.company,
      jobTitle: req.body.jobTitle,
    } }, { new: true }, (err, user) => {
      if (err) {
        console.log(err);
        res.render('../views/profiles/edit', { user: req.body });
      }
      res.redirect(`/profiles/${user._id}`);
    });
};

// DELETE user by id function for remove single user data
userController.delete = (req, res) => {
  User.remove({ _id: req.params.id }, (err) => {
    if (err) {
      console.log('Error: ', err);
    } else {
      console.log('User deleted!');
      res.redirect('/profiles');
    }
  });
};
module.exports = userController;
