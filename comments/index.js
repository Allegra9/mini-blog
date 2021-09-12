const express = require('express')
const { randomBytes } = require('crypto')

const app = express()
app.use(express.json())

// no database for this example project, will store in memory here:
const commentsByPostId = {}
// { postId: [{ id: 1, content: "lal" }, {...}] }

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id
  const comments = commentsByPostId[postId] || []
  res.send(comments)
})

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const postId = req.params.id

  const comments = commentsByPostId[postId] || []
  comments.push({ commentId, content })
  commentsByPostId[postId] = comments

  res.status(201).send(comments)
})

const PORT = 4001
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})