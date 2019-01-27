import express from 'express'
import passport from 'passport'

import notifyService from '../../../services/notify'

import User from '../../../models/user'

const router = express.Router()

router.all('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      res.status(401).send({
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

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!req.body.to || !req.body.title || !req.body.text) {
    res.status(401).send({
      status: 'failure',
      response: {
        message: 'invalid argruments',
      },
    })
  } else {
    notifyService(req.body.to, req.body.title, req.body.text)

    res.status(200).send({
      status: 'success',
      response: `sending push notification to ${req.body.to}`,
    })
  }
})

export default router
