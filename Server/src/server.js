const express = require('express')
const app = express()
require('dotenv').config()
const bodyparser = require('body-parser')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const secretKey = process.env.SECRET_KEY
const port = process.env.SERVER_PORT

app.use(bodyparser.json())
app.use(cors())

//ok
const all = require('./all-data')
const select = require('./select-data')
const singin = require('./singin-user')
const login = require('./login-user')
const tokens = require('./tokens')
const logout = require('./logout-user')

//no
// const insert = require('./insert')
// const delData = require('./delete-data')


app.get('/anime', async (req, res) => {
  const result = await all()
  res.json(result)
})

app.get('/anime/:id', async (req, res) => {
  const id = req.params.id
  const result = await select(id)
  res.json(result)
})

app.post('/singin', async (req, res) => {
  try {
    const { email, username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await singin({ email, username, password: hashedPassword })
    res.status(201).json({ message: 'Registrazione avvenuta con successo.' })
  } catch (error) {
    if (error) {
      res.status(400).json({ error: error })
    } else {
      res.status(500).json({ error: 'Errore durante la registrazione.' })
    }
  }
})

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await login({ username })

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide.' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenziali non valide.' })
    }

    const token = jwt.sign({ userId: user._id }, secretKey)
    const insertToken = tokens({ token })
    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login.' })
  }
})

app.delete('/logout', async (req, res) => {
  try {
    const { token } = req.body;

    const result = await logout({ token });

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Logout effettuato con successo.' });
    } else {
      res.status(404).json({ success: false, error: 'Token non trovato.' });
    }
  } catch (error) {
    console.error('Errore durante il logout:', error);
    res.status(500).json({ success: false, error: 'Errore durante il logout.' });
  }
})

app.get('/token', async (req, res) => {
  const result = await all()
  res.json(result)
})

//ok


//no
// app.post('/people', async (req, res) => {
//   const input = req.body
//   await insert(input)
// })

// // todo creare validazione per id - middelware
// app.post('/people/:id/appointments', async (req, res) => {
//   const appointment = req.body
//   const id = req.params.id
//   const result = await select(id)
//   if (result) {
//     res.json(await insert(appointment, "appointments")
//     )
//   } else {
//     res.status(404).json({ error: true, msg: "id non trovato" })
//   }
// })

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})