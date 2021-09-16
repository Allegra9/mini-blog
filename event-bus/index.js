const express = require('express')
const axios = require('axios')

const app = express()
app.use(express.json())

const sendEvent = (url, payload) => {
  axios.post(url, payload).catch(err => console.log(err.message))
}

app.post('/events', (req, res) => {
  const event = req.body

  sendEvent('http://localhost:4000/events', event)
  sendEvent('http://localhost:4001/events', event)
  sendEvent('http://localhost:4002/events', event)

  res.send({ status: 'OK' })
})

const PORT = 4005
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
