const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('mongoose-type-email');
const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'User needs a password']
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: [true, "Email is required"]
    },
    summary: {
        type: String
    },
    imageUrl: {
        type: String
    },
    company: {
        type: String
    },
    jobTitle: {
        type: String
    }
}, { timestamps: true });

userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR)
        .then(salt => {
            bcrypt.hash(user.password, salt)
                .then(hash => {
                    user.password = hash;
                    next();
                })
        })
        .catch(error => next(error));
});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
}


const User = mongoose.model('User', userSchema);
module.exports = User;