import express from 'express'
import dotenv from 'dotenv'
import passport from 'passport'

import User from '../../../models/user'

dotenv.config()
const {NODE_ENV} = process.env

const router = express.Router()

if (NODE_ENV === 'production') {
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
}

router.post('/', (req, res) => {
  const userData = new User({
    user: req.body.user,
    pass: req.body.pass,
  })

  User.register(userData, (err, user) => {
    if (err) {
      return res.status(401).send({
        status: 'failure',
        response: {
          message: 'failed to create new user',
          data: err,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'user created',
        },
      })
    }
  })
})

export default router
