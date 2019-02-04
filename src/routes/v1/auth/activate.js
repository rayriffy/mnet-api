import express from 'express'
import passport from 'passport'

import User from '../../../models/user'

const router = express.Router()

router.all('*', passport.authenticate('jwt', {session: false}), (req, res, next) => {
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
        res.status(400).send({
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
  User.activateUser(req.body.ref, (err, data) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    } else {
      if (data.n === 0) {
        return res.status(404).send({
          status: 'failure',
          response: {
            message: 'ref code is not found',
            data: data,
          },
        })
      } else {
        return res.status(200).send({
          status: 'success',
          response: {
            message: 'user activated',
          },
        })
      }
    }
  })
})

router.all('*', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

export default router
