import express from 'express'

import Notification from '../../../models/notification'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const groups = await Notification.find({}).sort({name: 1})

    const payload = []

    groups.map(group => {
      payload.push({
        id: group._id,
        name: group.name,
      })
    })

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'data retrived',
        data: {
          groups: payload,
        },
      },
    })
  } catch (err) {
    return res.status(400).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'unexpected error',
        data: err,
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
