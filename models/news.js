const mongoose = require('mongoose')

const Data = mongoose.model('Data', {
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },
    completed:{
        type:Boolean,
        default:false
    },
    image: {
        type: Buffer
    }
})

module.exports = Data