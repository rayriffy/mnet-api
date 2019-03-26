import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import User from '../models/user'

dotenv.config()
const {NODE_ENV = 'development', MOCHA_TEST = false} = process.env

const expo = new Expo()

export default async (to, title, body, type = 'group') => {
  if (NODE_ENV === 'production' || (NODE_ENV === 'production' && MOCHA_TEST === false)) {
    let messages = []
    let users = []

    if (type === 'group') {
      users = await User.find({'profile.notification.group': {$eq: to}})
    } else if (type === 'bulk') {
      _.each(to, user => {
        users.push(async () => {
          let out = await User.getUserById(user)
          return out
        })
      })

      await Promise.all(users)
    }

    if (!_.isEmpty(users)) {
      _.each(users, user => {
        if (Expo.isExpoPushToken(user.profile.notification.id)) {
          messages.push({
            to: user.profile.notification.id,
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
