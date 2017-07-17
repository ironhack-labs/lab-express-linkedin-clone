var express         = require('express');
const session       = require("express-session");
const bcrypt        = require('bcrypt');
const User          = require('../model/user');
const ensureLogin   = require("connect-ensure-login");

var router          = express.Router();
const bcryptSalt    = 10;

router.get("/", (req, res, next) => {
    let uid = req.session.passport.user;

    if( typeof uid !== "undefined") {
        res.redirect("/profile/"+uid);
    } else {
        res.redirect("/login");
    }  
});

router.get("/:userId", (req, res, next) => {
    let uid = req.params.userId;

     User.findOne({ "_id": uid }, (err, user) => {
        if(req.isAuthenticated()) {
            res.render("profiles/show", { user });
        } else {
            let obj = { username: user.username, name: user.name, imageUrl: user.imageUrl, jobTitle: user.jobTitle, company: user.company}
            res.render("profiles/show", { user: obj });
        }
    });
   
});


router.post("/:userId/", ensureLogin.ensureLoggedIn(), (req, res, next) => {
    const uid = req.params.userId;
    const currentPass = req.body.password;
    const newPass = req.body.repeatP;
    const avatar = req.body.avatar;
    const email = req.body.email;
    const name = req.body.name;
    const summary = req.body.summary;
    const company = req.body.company;
    const jobTitle = req.body.jobTitle;

    User.findOne({ "_id": uid }, (err, user) => {
        let newUser = {
                username: user.username,
                name: name,
                email: email,
                password: user.password,
                summary: summary,
                imageUrl: avatar,
                company: company,
                jobTitle: jobTitle
            };
        if( currentPass != "" && newPass != "") {
            if (bcrypt.compareSync(currentPass, user.password)) {
                var salt = bcrypt.genSaltSync(bcryptSalt);
                var hashPass = bcrypt.hashSync(newPass, salt);
                newUser.password = hashPass;
            }
        }

        User.findByIdAndUpdate(uid, newUser, {new : true}, function(err, user) {
            if (err){ return next(err); }
            return res.redirect("/profile/"+uid);
        });
    });
    
    
});

router.get("/:userId/edit", ensureLogin.ensureLoggedIn(), (req, res, next) => {
    let uid = req.params.userId;
    User.findOne({ "_id": uid }, (err, user) => {
        res.render("profiles/edit", { user });
    });
});

module.exports = router;