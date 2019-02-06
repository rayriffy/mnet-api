import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.get('/', (req, res) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    }
    if (!user) {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'user not found',
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          data: {
            user: {
              id: user._id,
              user: user.user,
              role: user.role,
              activation: user.activation,
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
    response: {
      message: 'invalid method',
    },
  })
})

export default router
