const express = require('express')
const multer = require('multer')

const Report= require('../models/news')
const user = require('../test/user')


const router = new express.Router()


router.post('/news',user.authorAu, async (req, res) => {
    try {
       
        const news = new news({ ...req.body,owner: req.author.id})
        await news.save()
        res.status(200).send(news)


    } catch (e) {
        res.status(400).send(e.message)
    }
})


router.get('/news/:id', user.authorAu, async (req, res) => {
    try {
       
        const news = await Report.findById({_id})


        if (!news) {
            return res.status(400).send('error')
        }
        res.status(200).send(news)
    } catch (e) {
        res.status(500).send(e.message)
    }
})



router.patch('/news/:id', user.authorAu, async (req, res) => {
    try {
        const _id = req.params.id
        const update = await Report.findOneAndUpdate({ _id }, req.body, { new: true, runValidators: true })
        
        
        if (!update) {
            return res.status(400).send('Unable')
        }
        res.status(200).send(update)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.delete('/news/:id', user.authorAu, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await Report.findOneAndDelete({_id})
        if (!news) {
            return res.status(400).send('Unable')
        }
        res.status(200).send(news)
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
            cb(new Error('plz upload image'))
        }
        cb(null, true)
    }
})
router.post('/news/:id', user.authorAu, uploads.single('image'), async (req, res) => {
    try {
        
        const news = await Report.findById({_id})
        if (!news) {
            return res.status(400).send('error')
        }
        news.image = req.file.buffer
        await news.save()
        res.send()
    } catch (e) {
        res.status(500).send(e.message)
    }
})


module.exports = router