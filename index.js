const express = require('express')
require('./db/mongoose')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const authorRouter = require('./router/author')
const newsRouter = require('./router/news')


app.use(express.json())
app.use(newsRouter)
app.use(authorRouter)


app.listen(port, () => {
    console.log('server enable')
})