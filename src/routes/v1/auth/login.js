import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.get('/', (req, res) => {
  User.authenticate(req.body.user, req.body.pass, (err, user) => {
    if (err || !user) {
      return res.status(401).send({
        status: 'failure',
        response: {
          message: 'user not found',
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'authenticated',
          data: {
            id: user._id,
          },
        },
      })
    }
  })
})

export default router
