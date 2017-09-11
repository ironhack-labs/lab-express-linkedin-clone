var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const User = require('../models/User');
const bcryptSalt = 10;


/*SINGUP print*/
router.get('/signup', (req, res) => {
  res.render('auth/signup', {
    title: 'Signup'
  });
});


/*SINGUP create the user*/


router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const email = req.body.email;

  if (username === "" || password === "" || name === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "fill up all the cells"
    });
    return;
  }

  User.findOne({ "username": username }).then(user =>{
    if(user){
      res.render("auth/signup", {
        errorMessage: "User already exists"
      });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    new User({
        username: username,
        password: hashPass,
        name: name,
        email: email

      })
      .save()
      .then(() => res.redirect('/'))
      .catch(e => next(e));
  });

});


/*MAIN MENU gET */
router.get('/', function(req, res, next) {
  res.send('/',  {
    title: 'Wellcome'
  });
});



/*LOGIN VAMONOS*/
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login Here!'
  });
});

/*LOGIN respuesta*/

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;


  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/profile");
        console.log ("eres tu");
        return user;
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }


  });
});
// LOGOUT
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    // cannot access session here
    res.redirect("/login");
  });
});


// SHOW profiles

router.get('/profile', (req, res, next) => {
  User.find()
    .then(result => res.render('profiles/main', {users: result}))
    .reject (err => console.log(err));
});

// SHOW edit my profile

router.get('/editprofile/:id', (req,res, next) => {
   res.render('profiles/update.ejs', {yomismo: req.session.currentUser});

  });

//EDIT DB my profile

router.post('/editprofile/:id', (req, res, next) => {
  const update = {
    username: req.body.username,
    password : req.body.password,
    name:req.body.name,
    email:req.body.email
  };
  nuestroIdquerido = req.session.currentUser._id;
  console.log(nuestroIdquerido);



  User.findByIdAndUpdate(nuestroIdquerido, update)
    .then(result => res.redirect('/itsme/:id'))
    .catch(err => console.log ("Error al crear Celebrity"));
});

// MYPROFILE SHOW

router.get('/itsme/:id', (req,res, next) => {
   res.render('profiles/yourprofile.ejs', {yomismo: req.session.currentUser});

  });


module.exports = router;
