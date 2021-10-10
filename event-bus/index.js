const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

const events = []

const sendEvent = (url, payload) => {
  axios.post(url, payload).catch(err => console.log(err.message))
}

app.post('/events', (req, res) => {
  const event = req.body

  events.push(event)

  sendEvent('http://posts-clusterip-srv:4000/events', event)
  sendEvent('http://comments-srv:4001/events', event)
  sendEvent('http://query-srv:4002/events', event)
  sendEvent('http://moderation-srv:4003/events', event)

  res.send({ status: 'OK' })
})

app.get('/events', (req, res) => {
  res.send(events)
})

const PORT = 4005
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
