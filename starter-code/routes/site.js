const routes = require("express").Router();
const auth = require("../helpers/auth.js");
const User = require("../models/user.js");

routes.get("/", auth.checkLoggedIn('authentication/login'), (req, res, next)=>{
    User.find({}, "name posts", (err, users)=>{
        var posts = [];
        users.forEach((user)=>user.posts.forEach((post)=>posts.push({name: user.name, post })));
        res.render('home', {user:req.session.user, posts});
    })
    
});

module.exports = routes;