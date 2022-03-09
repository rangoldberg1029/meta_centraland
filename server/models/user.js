const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    keys: {
        type: Object
    },
    balance: {
        type: Number
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User;