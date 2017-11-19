const express = require('express');
const User = require('../models/user');
const router = express.Router();
const multer  = require('multer');
const uploader = multer({dest:'./public/uploads'});
const Picture = require('../models/Image')

router.use((req, res, next) => {
 if (req.session.currentUser){
   next();
   return;
 }
 res.redirect('/:id/post');
})

router.get('/:id/post', (req, res, next) => {
  res.render('/auth/show', {
    currentUser: req.session.currentUser
  });
});
