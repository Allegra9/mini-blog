const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

// will receive events from event bus
app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type === 'CommentCreated') {
    const { content, state } = data

    const updatedState = content.includes('orange') ? 'rejected' : 'approved'

    // emit to event broker:
    await axios.post('http://localhost:4005/events', {
      type: 'CommentModerated',
      data: { ...data, state: updatedState }
    })
  }

  res.send({})
})

const PORT = 4003
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
