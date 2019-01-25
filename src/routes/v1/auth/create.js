import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.get('/', (req, res) => {
  const userData = {
    username: req.body.user,
    password: req.body.pass,
  }

  User.create(userData, (err, user) => {
    if (err) {
      return res.status(401).send({
        status: 'failure',
        response: {
          message: err,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'user created',
          data: {
            id: user._id,
          },
        },
      })
    }
  })
})

export default router
