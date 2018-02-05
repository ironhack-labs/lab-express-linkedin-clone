const mongoose = require("mongoose");
const Auth = require("../models/user");

mongoose.connect("mongodb://localhost/linkedin-db").then(() => console.log("Conectado"));

const auth = [
    {
        username: 'Jr',
        name: 'John',
        email: 'paco@paco.com',
        password: '123',
        summary: 'ten years in Ironhack',
        imageUrl: 'http://www.dogguie.net/wp-content/uploads/2010/04/toma-shopas-dientes-04.jpg',
        company: 'Ironhack',
        jobTitle: 'Vividor'
    },
]

Auth.collection.drop();

auth.forEach(c => {
    let au = new Auth(c);
    au.save((err, auth) => {
        if (err) {
            throw err;
        }
        console.log(`User saved ${auth.name}`);
        // mongoose.disconnect();
    })
});