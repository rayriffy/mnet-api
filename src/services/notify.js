import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const {FCM_KEY} = process.env

export default (to, title, text) => {
  const payload = {
    to: `/topics/${to}`,
    priority: 'normal',
    notification: {
      title: title,
      text: text,
    },
  }

  const options = {
    headers: {
      Authorization: `key=${FCM_KEY}`,
      'Content-Type': 'application/json',
    },
  }

  axios.post('https://fcm.googleapis.com/fcm/send', payload, options)
}
