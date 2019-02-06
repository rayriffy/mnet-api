import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res) => {
  const refCode = Math.random()
    .toString(36)
    .substr(2, 8)
  const payload = new User({
    authentication: {
      user: req.body.user,
      pass: req.body.pass,
    },
    activation: {
      ref: refCode,
    },
    profile: {
      fullname: req.body.fullname,
    },
  })

  User.addUser(payload, (err, user) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'failed to create new user',
          data: err,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
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
