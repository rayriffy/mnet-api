import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
const {FCM_KEY} = process.env
const {NODE_ENV = 'development', MOCHA_TEST = false} = process.env

export default (to, title, text) => {
  if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
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

    return axios.post('https://fcm.googleapis.com/fcm/send', payload, options)
  } else {
    return true
  }
}
