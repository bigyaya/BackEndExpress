// const { Admin } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true}, //'unique' = un email unique pour le user
    password: {type: String, required: true},
    date: { type: Date, default: Date.now },
    admin: {type: Boolean}
})

module.exports = mongoose.model('User', userSchema);