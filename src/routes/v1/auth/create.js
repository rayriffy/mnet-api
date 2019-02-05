import express from 'express'

import invalidMethodMiddleware from '../../../middlewares/v1/invalidMethodMiddleware'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res) => {
  const refCode = Math.random()
    .toString(36)
    .substr(2, 8)
  const payload = new User({
    user: req.body.user,
    pass: req.body.pass,
    activation: {
      ref: refCode,
    },
  })

  User.addUser(payload, (err, user) => {
    if (err) {
      return res.status(400).send({
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
          data: {
            user: {
              activation: {
                ref: refCode,
              },
            },
          },
        },
      })
    }
  })
})

router.use('/', invalidMethodMiddleware)

export default router
