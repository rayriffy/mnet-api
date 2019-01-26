import express from 'express'
import jwt from 'jsonwebtoken'

import dbConfig from './config/database'

import User from '../../../models/user'

const router = express.Router()

router.get('/', (req, res) => {
  User.getUserByUsername(req.body.user, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        status: 'failure',
        response: {
          message: 'user not found',
        },
      })
    } else {
      User.comparePassword(req.body.pass, user.pass, (err, res) => {
        if (err) {
          return res.status(401).send({
            status: 'failure',
            response: {
              message: 'unexpected error',
              data: err,
            },
          })
        }
        if (res) {
          const token = jwt.sign(user, dbConfig.secret, {expiresIn: 18144000})
          return res.status(200).send({
            status: 'success',
            response: {
              message: 'authenticated',
              data: {
                token: 'JWT ' + token,
                user: {
                  id: user._id,
                  user: user.user,
                },
              },
            },
          })
        } else {
          return res.status(401).send({
            status: 'failure',
            response: {
              message: 'invalid password',
            },
          })
        }
      })
    }
  })
})

export default router
