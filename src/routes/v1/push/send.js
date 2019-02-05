import express from 'express'

import invalidMethodMiddleware from '../../../middlewares/v1/invalidMethodMiddleware'

import notifyService from '../../../services/notify'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res, next) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      res.status(404).send({
        status: 'failure',
        response: {
          message: 'id not found',
        },
      })
    } else {
      if (user.role !== 'administrator') {
        res.status(401).send({
          status: 'failure',
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
      response: {
        message: 'invalid argruments',
      },
    })
  } else {
    notifyService(req.body.to, req.body.title, req.body.text)

    res.status(202).send({
      status: 'success',
      response: `sending push notification to ${req.body.to}`,
    })
  }
})

router.use('/', invalidMethodMiddleware)

export default router
