import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res) => {
  const userData = new User({
    user: req.body.user,
    pass: req.body.pass,
  })

  User.addUser(userData, (err, user) => {
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
