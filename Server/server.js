const express = require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
app.use(bodyparser.json())

const select = require('./src/select-data')
const insert = require('./src/insert-data')


app.get('/people', async (req, res) => {
    const result = await select()
    res.json(result)
})

app.get('/people/:id', async (req, res) => {
    const id = req.params.id
    const result = await select(id)
    res.json(result)
})

app.post('/people', async (req, res) => {
    const input = req.body
    await insert(input)
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})