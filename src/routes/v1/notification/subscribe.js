import _ from 'lodash'
import express from 'express'

import Notification from '../../../models/notification'
import Subscriber from '../../../models/subscriber'

const router = express.Router()

router.post('/', (req, res, next) => {
  if (!req.body.token || !req.body.group) {
    res.status(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'provided data is not enough',
      },
    })
  } else {
    next()
  }
})

router.post('/', async (req, res, next) => {
  const {group} = req.body

  const notificationGroup = await Notification.findById(group)

  if (_.isEmpty(notificationGroup)) {
    return res.status(404).send({
      status: 'failure',
      code: 704,
      response: {
        message: 'notification group is not found',
      },
    })
  } else {
    next()
  }
})

router.post('/', async (req, res) => {
  const {token, group} = req.body

  try {
    const out = await Subscriber.subscribe(group, token)

    if (out === false) {
      return res.status(400).send({
        status: 'failure',
        code: 706,
        response: {
          message: 'this token is already added into this group notification',
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'this token has been subscribed to requested group',
        },
      })
    }
  } catch (err) {
    return res.status(400).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'unexpected error',
        data: err.message,
      },
    })
  }
})

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
