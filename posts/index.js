const express = require('express')
const { randomBytes } = require('crypto')

const app = express()
app.use(express.json())

// no database for this example project, will store in memory here:
const posts = {}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts', (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body

  posts[id] = {
    id, title
  }

  res.status(201).send(posts[id])
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})