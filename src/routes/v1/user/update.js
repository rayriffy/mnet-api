import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.put('/', (req, res) => {
  User.updateUserProfile(req.user.id, req.body.profile, (err, data) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    } else {
      if (data.n === 0) {
        return res.status(404).send({
          status: 'failure',
          code: 704,
          response: {
            message: 'user id is not found',
            data: data,
          },
        })
      } else {
        return res.status(200).send({
          status: 'success',
          code: 201,
          response: {
            message: 'user updated',
          },
        })
      }
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
