const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const validator = require('validator')


const iSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid')
            }
        }
    },
    age: {
        type: Number,
        default: 20,
        validate(value) {
            if (value < 0) {
                throw new Error("positive number")
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
        validate(value) {
            let stRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if (!stRegex.test(value)) {
                throw new Error('Pass must be uppercase & lowercase & be number')
            }
        }
    },
    address: {  
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        validate(value) {
            let telRegex = new RegExp("^01[0-2,5]{1}[0-9]{8}$")
            if (!telRegex.test(value)) {
                throw new Error('Invalid no.')
            }
        }
    },
    avatar: {
        type: Buffer
    },
  
    tokens: [{
        type: String,
        required: true
    }]
})



iSchema.pre('save', async function () {
    const author = this
    if (author.isModified('password')) {author.password = await bcrypt.hash(author.password, 8)}
})


iSchema.statics.findByCredentials = async (email, password) => {
    const author = await Author.findOne({
        email
    })
    if (!author) {
        throw new Error('unable to login.. check password or Email')
    }
    const isMatch = await bcrypt.compare(password, author.password)
    if (!isMatch) {
        throw new Error('unable to login.. check password or Email')
    }
    return author
}


iSchema.methods.generateToken = async function () {
    const author = this
    const token = jwt.sign({_id: author._id.toString()}, process.env.JWT_ST)

    author.tokens = author.tokens.concat(token)
    await author.save()
    return token
}

const Author = mongoose.model('Author',iSchema)
module.exports = Author