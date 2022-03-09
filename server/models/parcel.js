const mongoose = require('mongoose')


const parcelSchema = mongoose.Schema({
    rowIndex: {
        type: Number
    },

    colIndex: {
        type: Number
    },

    status: {
        type: Number,
        required: true,
    },

    block: {
        type: Object
    },

    price: {
        type: Number
    },
    game: {
        type: Boolean
    },
    owner: {
        type: Object
    }
})

const Block = mongoose.model('Block', parcelSchema)
module.exports = Block