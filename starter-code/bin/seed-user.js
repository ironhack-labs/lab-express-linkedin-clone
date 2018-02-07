const mongoose = require('mongoose');
const { dbUrl } = require('../config');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
var salt = bcrypt.genSaltSync(bcryptSalt);

mongoose.connect(dbUrl).then(() => console.log('db running'));

const users = [
    new User({ username: 'Kanye', password:bcrypt.hashSync('kanye', salt) }),
    new User({ username: 'Kim', password:bcrypt.hashSync('kim', salt) }),
    new User({username: 'Travis', password:bcrypt.hashSync('travis', salt) })
];

//vacía la collection
User.collection.drop();

//recorre el array de users y crea objetos
User.create(users, (err, user) => {
    console.log("creating users...")
    if (err) {
        console.log(`user could not be saved`);
        throw err;
    }
    user.forEach((u) => {
        console.log(`user added ${u.username}`)
    });
    //cierra la conexion
    mongoose.connection.close();
});

