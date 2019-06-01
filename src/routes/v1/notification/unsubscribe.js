import express from 'express'

import Subscriber from '../../../models/subscriber'

const router = express.Router()

router.delete('/', (req, res, next) => {
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

router.delete('/', async (req, res) => {
  const {token, group} = req.body

  try {
    await Subscriber.unsubscribe(group, token)

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'subscriber sucessfully deleted',
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
