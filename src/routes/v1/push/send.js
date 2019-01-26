import axios from 'axios'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const {FCM_KEY} = process.env

const router = express.Router()

router.post('/', (req, res) => {
  const payload = {
    to: `/topics/${req.body.to}`,
    priority: 'normal',
    notification: {
      title: req.body.title,
      text: req.body.text,
    },
  }

  const options = {
    headers: {
      Authorization: `key=${FCM_KEY}`,
      'Content-Type': 'application/json',
    },
  }

  axios.post('https://fcm.googleapis.com/fcm/send', payload, options)

  res.status(200).send({
    status: 'success',
    response: `sending push notification to ${req.body.to}`,
  })
})

export default router
