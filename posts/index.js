const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

// no database for this example project, will store in memory here:
const posts = {}

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts/create', async (req, res) => {
  const id = randomBytes(4).toString('hex')
  const { title } = req.body
  if (!title) return

  posts[id] = {
    id,
    title
  }

  // emit to event broker:
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title
    }
  })

  res.status(201).send(posts[id])
})

// will receive events from event bus
app.post('/events', (req, res) => {
  console.log('received:', req.body.type)

  res.send({})
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
