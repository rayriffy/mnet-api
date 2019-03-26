import _ from 'lodash'
import dotenv from 'dotenv'
import Expo from 'expo-server-sdk'

import User from '../models/user'

dotenv.config()
const {NODE_ENV = 'development', MOCHA_TEST = false} = process.env

const expo = new Expo()

export default async (to, title, body, type = 'group') => {
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
        console.log(user.profile.notification.id)
        if (Expo.isExpoPushToken(user.profile.notification.id)) {
          messages.push(addMessages(user.profile.notification.id, title, body))
        }
      })

      await Promise.all(messages)

      console.log(messages)

      let chunks = expo.chunkPushNotifications(messages)

      _.each(chunks, async chunk => {
        await expo.sendPushNotificationsAsync(chunk)
      })
    }
  }

  return true
}
