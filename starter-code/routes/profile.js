const express = require("express");
const router = express.Router();
const moment = require("moment");
const User = require("../models/User");

//For protect the path
router.get('/', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/');//Esto te lleva a buscar la ruta en app.js
  }else {
    let id = req.session.currentUser._id;
    console.log(id);
    User.findById(id)
      .then((user) => {
        res.render('profile/show', {//Esto pinta la vista de la ruta indicada, llevando consigo el objeto en el segundo parámetro
          user : user
        });
      }).catch((err) => {
        return next(err);
      });
    }
});

//Para otro momento la edición del perfil
// router.get('/:id', (req, res, next) => {
//
// });

module.exports = router;
