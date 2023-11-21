const express = require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
const cors = require('cors')

app.use(bodyparser.json())
app.use(cors())

const all = require('./all-data')
const select = require('./select-data')
const insert = require('./insert')
const delData = require('./delete-data')


app.get('/anime', async (req, res) => {
  const result = await all()
  res.json(result)
})

app.get('/anime/:id', async (req, res) => {
  const id = req.params.id
  const result = await select(id)
  res.json(result)
})

//ok



app.post('/people', async (req, res) => {
  const input = req.body
  await insert(input)
})

// todo creare validazione per id - middelware
app.post('/people/:id/appointments', async (req, res) => {
  const appointment = req.body
  const id = req.params.id
  const result = await select(id)
  if (result) {
    res.json(await insert(appointment, "appointments")
    )
  } else {
    res.status(404).json({ error: true, msg: "id non trovato" })
  }
})

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running on port ${process.env.SERVER_PORT}`)
})