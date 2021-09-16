const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

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

  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = {
      id,
      title,
      comments: []
    }
  }

  if (type === 'CommentCreated') {
    const { id, postId, content } = data
    const post = posts[postId]
    post.comments.push({ id, content })
  }

  console.log(posts)
  res.send({})
})

const PORT = 4002
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
