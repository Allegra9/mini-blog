const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

// no database for this example project, will store in memory here:
const commentsByPostId = {}
// { postId: [{ id: 1, content: "lal" }, {...}] }

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id
  const comments = commentsByPostId[postId] || []
  res.send(comments)
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const postId = req.params.id

  const comments = commentsByPostId[postId] || []
  const data = { id: commentId, content, state: 'pending' }
  if (!content) return
  comments.push(data)
  commentsByPostId[postId] = comments

  // emit to event broker:
  await axios.post('http://localhost:4005/events', {
    type: 'CommentCreated',
    data: { ...data, postId }
  })

  res.status(201).send(comments)
})

// will receive events from event bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body
  console.log('received:', req.body.type)

  if (type === 'CommentModerated') {
    const { id, postId, state } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find(comment => comment.id === id)
    comment.state = state

    // emit to event broker:
    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data
    })
  }

  res.send({})
})

const PORT = 4001
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
