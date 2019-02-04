import dotenv from 'dotenv'
import express from 'express'
import jwt from 'jsonwebtoken'

import User from '../../../models/user'

dotenv.config()
const {SECRET} = process.env

const router = express.Router()

router.post('/', (req, res) => {
  User.getUserByUsername(req.body.user, (err, user) => {
    if (err || !user) {
      return res.status(404).send({
        status: 'failure',
        response: {
          message: 'user not found',
        },
      })
    } else {
      User.comparePassword(req.body.pass, user.pass, (err, compare) => {
        if (err) {
          return res.status(400).send({
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
          const token = jwt.sign(payload, SECRET, {expiresIn: 6 * 30 * 24 * 60 * 60})
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
          return res.status(400).send({
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

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

export default router
