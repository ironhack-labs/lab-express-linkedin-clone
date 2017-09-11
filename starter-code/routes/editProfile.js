// const express = require('express');
// const router  = express.Router();
// const User = require ('../models/user');
//
//
// router.get('/:id', (req,res, next) => {
//   User.findById(req.params.id)
//     .then(result => res.render('/editProfile', {user:result}))
//     .reject (err => console.log(err));
// });

// router.post('/update/:id', (req, res, next) => {
//   const update = {
//     name: req.body.nameBB,
//     ocupation: req.body.ocupation,
//     catchPhrase:req.body.catchPhrase
//   };
//   Celebrities.findByIdAndUpdate(req.params.id , update)
//     .then(result => res.render('index.ejs'))
//     .catch(err => console.log ("Error al crear Celebrity"));
// });
