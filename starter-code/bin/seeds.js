/*
const mongoose = require("mongoose");
const Auth = require("../models/user");

mongoose.connect("mongodb://localhost/linkedin-dev").then(() => console.log("Conectado"));

const auth = [
  { name: 'John', 
  email: 'exxample@gmail.com',
  password: '123',
  summary : 'summary',
  imageUrl: 'imageurl',
  company: 'company',
  jobTitle: 'job'
  }, {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }];

Auth.collection.drop();

auth.forEach( c => {
  let au = new Auth(c);
  au.save((err, auth) => {
    if(err){
      throw err;
    }
    console.log(`Contacto guardado ${auth.name}`);
   // mongoose.disconnect();
  })
});
*/