import express from 'express'
import jwt from 'jsonwebtoken'

import dbConfig from '../../../config/database'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res) => {
  User.getUserByUsername(req.body.user, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        status: 'failure',
        response: {
          message: 'user not found',
        },
      })
    } else {
      User.comparePassword(req.body.pass, user.pass, (err, compare) => {
        if (err) {
          return res.status(401).send({
            status: 'failure',
            response: {
              message: 'unexpected error',
              data: err,
            },
          })
        }
        if (compare) {
          const payload = {
            id: user._id,
            user: user.user,
          }
          const token = jwt.sign(payload, dbConfig.secret, {expiresIn: 18144000})
          return res.status(200).send({
            status: 'success',
            response: {
              message: 'authenticated',
              data: {
                token: 'JWT ' + token,
                user: payload,
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
