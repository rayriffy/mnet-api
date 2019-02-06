import express from 'express'

import notifyService from '../../../services/notify'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res, next) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'user not found',
        },
      })
    } else {
      if (user.authentication.role !== 'administrator') {
        res.status(401).send({
          status: 'failure',
          code: 707,
          response: {
            message: 'insufficient permission',
          },
        })
      } else {
        next()
      }
    }
  })
})

router.post('/', (req, res) => {
  if (!req.body.to || !req.body.title || !req.body.text) {
    res.status(406).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'invalid argruments',
      },
    })
  } else {
    notifyService(req.body.to, req.body.title, req.body.text)

    res.status(202).send({
      status: 'success',
      code: 202,
      response: {
        message: `sending push notification to ${req.body.to}`,
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
