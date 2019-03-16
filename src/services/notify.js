import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import User from '../models/user'

dotenv.config()
const {NODE_ENV = 'development', MOCHA_TEST = false} = process.env

const expo = new Expo()

export default async (to, title, body) => {
  if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
    let addMessages = async (token, title, body) => {
      return {
        to: token,
        sound: 'default',
        title: title,
        body: body,
      }
    }

    let messages = []

    let tokens = await User.find({group: {$eq: to}}).select('push.id')

    _.each(tokens, token => {
      if (Expo.isExpoPushToken(token)) {
        messages.push(addMessages(token, title, body))
      }
    })

    await Promise.all(messages)

    let chunks = expo.chunkPushNotifications(messages)

    _.each(chunks, async chunk => {
      await expo.sendPushNotificationsAsync(chunk)
    })
  }

  return true
}
