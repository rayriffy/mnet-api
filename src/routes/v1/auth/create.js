import express from 'express'

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

export default router
