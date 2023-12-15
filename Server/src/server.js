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

const select = require('./select-data')
const singin = require('./singin-user')
const login = require('./login-user')
const tokens = require('./tokens')
const logout = require('./logout-user')
const addOnList = require('./add-on-list')
const addComment = require('./add-comment')
const delOnList = require('./del-on-list')
const delComment = require('./del-comment')
const putComment = require('./put-comment')
const putUser = require('./put-user')
const delUser = require('./del-user')

app.get('/anime', async (req, res) => {
  try {
    const id = ''
    const result = await select('Anime', id)
    res.json(result)

  } catch (error) {
    res.status(500).json({ error: `Errore nel server` })
  }
})

app.get('/anime/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await select('Anime', id)
    res.json(result)

  } catch (error) {
    res.status(500).json({ error: `Errore nel server` })
  }
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
    const insertToken = await tokens({ token })
    const result = { token, username }
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Errore durante il login.' })
  }
})

app.delete('/logout', async (req, res) => {
  try {
    const { token } = req.body

    const result = await logout({ token })

    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Logout effettuato con successo.' })
    } else {
      res.status(404).json({ success: false, error: 'Token non trovato.' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Errore durante il logout.' })
  }
})

app.post('/myLists', async (req, res) => {
  try {
    const { animeId, token, nameList } = req.body
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId

    const result = await addOnList(animeId, userId, nameList)

    res.status(201).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: `Errore durante l'aggiunta alla lista` })
  }
})

app.get('/comments/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await select('Comments', id)
    res.json(result)

  } catch (error) {
    res.status(500).json({ error: `Errore nel server` })
  }
})

app.post('/comments/:id/comment', async (req, res) => {
  try {
    const id = req.params.id
    const { token, user, comment } = req.body
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId

    const result = await addComment(id, user, userId, comment)

    res.status(201).json({ success: true })
  } catch {
    res.status(500).json({ error: `Errore durante l'aggiunta del commento` })
  }
})

app.get('/myLists', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId
    const result = await select('List', userId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: `Errore nel server` })
  }
})

app.delete('/myLists', async (req, res) => {
  try {
    const { animeId, token, nameList } = req.body
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId

    const result = await delOnList(animeId, userId, nameList)

    if (result.modifiedCount > 0) {
      res.json({ success: true, message: 'Anime rimosso con successo.' })
    } else {
      res.status(404).json({ success: false, error: 'anime non trovato.' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Errore durante la rimozione dell'anime.`
    })
  }
})

app.delete('/comments/:id/comment', async (req, res) => {
  try {
    const id = req.params.id
    const { commentId } = req.body

    const result = await delComment(id, commentId)

    if (result.modifiedCount > 0) {
      res.json({ success: true, message: 'Commento rimosso con successo.' })
    } else {
      res.status(404).json({ success: false, error: 'Commento non trovato.' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Errore durante la rimozione del commento.`
    })
  }
})

app.put('/comments/:id/comment', async (req, res) => {
  try {
    const id = req.params.id
    const { commentId, newText } = req.body

    const result = await putComment(id, commentId, newText)

    if (result.modifiedCount > 0) {
      res.json({ success: true, message: 'Commento modificato con successo.' })
    } else {
      res.status(404).json({ success: false, error: 'Commento non trovato.' })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Errore durante la modifica del commento.`
    })
  }
})

app.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId
    const user = await select('Users', userId)

    const result = {
      username: user.username,
      email: user.email
    }

    res.json(result)

  } catch (error) {
    res.status(500).json({ error: `Errore nel server` })
  }
})

app.put('/user', async (req, res) => {
  try {
    const { token, dataField, newData, oldPass } = req.body
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId

    let result = undefined
    if (dataField == 'password') {
      const user = await select('Users', userId)
      const passwordMatch = await bcrypt.compare(oldPass, user.password)

      if (passwordMatch) {
        if (oldPass === newData) {
          const error = 'La nuova password deve essere diversa da quella vecchia'
          throw error
        }
        const hashedPassword = await bcrypt.hash(newData, 10)
        result = await putUser(userId, dataField, hashedPassword)
      } else {
        const error = 'Credenziali errate'
        throw error
      }
    } else {
      result = await putUser(userId, dataField, newData)
    }

    if (result && result.modifiedCount > 0) {
      res.json({ success: true, message: 'Modificato con successo.' })
    } else {
      res.status(204).json({ success: false, error: 'Modifica non effettuata.' })
    }
  } catch (error) {
    if (error) {
      res.status(400).json({ error: error })
    } else {
      res.status(500).json({ error: 'Errore durante la modifica.' })
    }
  }
})

app.delete('/user', async (req, res) => {
  try {
    const { token, password } = req.body
    const decodedToken = jwt.verify(token, secretKey)
    const userId = decodedToken.userId
    const user = await select('Users', userId)
    const passwordMatch = await bcrypt.compare(password, user.password)

    let result = ""

    if (passwordMatch) {
      result = await delUser(userId, token)
    } else {
      const error = 'Credenziali errate'
      throw error
    }

    if (result && result.deletedCount > 0) {
      res.json({ success: true, message: 'Account rimosso con successo.' })
    } else {
      res.status(404).json({ success: false, error: 'Account non trovato.' })
    }
  } catch (error) {
    if (error) {
      res.status(400).json({ error: error })
    } else {
      res.status(500).json({ error: `Errore durante la rimozione dell' account.` })
    }
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})