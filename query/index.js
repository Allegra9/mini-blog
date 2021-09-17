const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = {
      id,
      title,
      comments: []
    }
  }

  if (type === 'CommentCreated') {
    const { id, postId, content, state } = data
    const post = posts[postId]
    post.comments.push({ id, content, state })
  }

  if (type === 'CommentUpdated') {
    const { id, postId, content, state } = data
    const post = posts[postId]
    const comment = post.comments.find(comment => comment.id === id)
    comment.state = state
    comment.content = content
  }
}

// no database for this example project, will store in memory here:
const posts = {}
// {
//   '12gnj4': {
//     id: '12gnj4',
//     title: 'fddd',
//     comments: [
//       { id: 1, content: "lal" }
//     ]
//   }
// }

app.get('/posts', (req, res) => {
  res.send(posts)
})

// will receive events from event bus
app.post('/events', (req, res) => {
  const { type, data } = req.body
  handleEvent(type, data)

  res.send({})
})

const PORT = 4002
app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`)

  try {
    // get all events from event bus and process them:
    const res = await axios.get('http://localhost:4005/events')

    for (let event of res.data) {
      const { type, data } = event
      console.log('Processing event:', type)

      handleEvent(type, data)
    }
  } catch (error) {
    console.log(error.message)
  }
})
