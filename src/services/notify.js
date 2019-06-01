import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import Notification from '../models/notification'
import Subscriber from '../models/subscriber'

dotenv.config()
const {NODE_ENV = 'development', MOCHA_TEST = false} = process.env

const expo = new Expo()

export default async (to, title, body) => {
  if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
    const group = await Notification.findOne({name: {$eq: to}})

    if (group === null) {
      return false
    } else {
      const messages = []
      const subscribers = await Subscriber.find({group: {$eq: group}})

      subscribers.map(subscriber => {
        if (Expo.isExpoPushToken(subscriber.token)) {
          messages.push({
            to: subscriber.token,
            sound: 'default',
            title: title,
            body: body,
          })
        }
      })

      let chunks = expo.chunkPushNotifications(messages)

      _.each(chunks, async chunk => {
        await expo.sendPushNotificationsAsync(chunk)
      })
    }
  }

  return true
}
