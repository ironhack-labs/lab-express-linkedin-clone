var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const User = require("../models/User");

router.get('/', function(req, res, next) {
  
    if(req.session.currentUser){
      res.redirect("/profile/"+req.session.currentUser._id+"/edit")
    } else{
        res.redirect("/authentication/login")
    }
});
router.get('/:id/', function(req, res, next) {
  
    if(req.session.currentUser){
        User.findOne({_id:req.params.id}, (err,doc)=>{
            if(err){
                res.redirect("/");
            } else {
                if (req.session.currentUser._id === req.params.id){
                    res.render("profiles/show.ejs", {edit: true, showUser: doc, logged: true})
                } else {
                    res.render("profiles/show.ejs", {edit: false, showUser: doc, logged: true})
                }
            }
            
          });
        
    } else{
        User.findOne({_id:req.params.id}, (err,doc)=>{
            if(err){
                res.redirect("/");
            } else {
                    res.render("profiles/show.ejs", {edit: false, showUser: doc, logged: false})
            }
          });
    }
});

router.get('/:id/edit', function(req, res, next) {
  
    if(req.session.currentUser){
        if (req.session.currentUser._id === req.params.id){
            res.render("profiles/edit.ejs", {user: req.session.currentUser})
        } else {
            res.redirect("/")
        }
    } else{
        res.redirect("/authentication/login")
    }
});


router.post('/:id/', function(req, res, next) {
    if(req.session.currentUser){
        User.findByIdAndUpdate(req.params.id, {
            userName: req.body.username,
            name: req.body.name, 
            email: req.body.email,
            summary: req.body.summary,
            imageUrl: req.body.imageUrl,
            company: req.body.company,
            jobTitle: req.body.jobTitle
            },(err)=>{
          if (err) {
            next();
            return;   
          } else{
            res.redirect("/profile/"+req.session.currentUser._id)
          }
          });
    } else{
        res.redirect("/authentication/login")
    }
    
});

router.get('/:id/connect', function(req, res, next) {
    if(req.session.currentUser){
        let connectName = "";
        User.findOne({_id:req.params.id}, (err,doc)=>{
            if(err){
                res.redirect("/");
                return;
            } else {
                console.log(doc)
                connectName = doc.name;
                User.findByIdAndUpdate(req.session.currentUser._id, {
                    $push: { connections: {id: req.params.id, name: connectName} }
                    }, { 'new': true} ,(err)=>{
                        if (err) {
                            next();
                            return;   
                        } else{
                            res.redirect("/profile/"+req.session.currentUser._id)
                        }
                    });
            }
          });
        
    } else{
        res.redirect("/authentication/login")
    }
});


module.exports = router;
