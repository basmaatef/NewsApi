const express = require('express')
const multer = require('multer')
const Author = require('../models/author')
const user = require('../test/user')


const router = new express.Router()

router.post('/signUp', async (req, res) => {
    try {
        const author = new Author(req.body)
        await author.save()
        const token = await author.generateToken()
        res.status(200).send({
            author,
            token
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.post('/login', async (req, res) => {
    try {
        const author = await Author.findByCredentials(req.body.email, req.body.password)
        const token = await author.generateToken()
        res.status(200).send({
            author,
            token
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/profile', user.authorAu, async (req, res) => {
    res.status(200).send(req.author)
})

router.patch('/profile', user.authorAu, async (req, res) => {
    try {
        const data = Object.keys(req.body)
        if (!req.author) {
            return res.status(400).send('Unable')
        }
        data.forEach((el) => (req.author[el] = req.body[el]))
        await req.author.save()

        res.status(200).send(req.author)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.delete('/profile',user.authorAu, async (req, res) => {
    try {
        const _id = req.author.$id
        const author = await Author.findByIdAndDelete(_id)
        if (!author) {
            return res.status(400).send('Unable')
        }
        res.status(200).send(req.author)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/logout', user.authorAu, async (req, res) => {
    try {
        req.author.tokens = req.author.tokens.filter((el) => {
            return el !== req.token
        })
        await req.author.save()
        res.send('you can Logout')
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/logoutAll', user.authorAu, async (req, res) => {
    try {
        req.author.tokens = []
        await req.author.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


const uploads = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            cb(new Error('upload img'))
        }
        cb(null, true)
    }
})
router.post('/profile/avatar', user.authorAu, uploads.single('avatar'), async (req, res) => {
    try {
        req.author.avatar = req.file.buffer
        await req.author.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router