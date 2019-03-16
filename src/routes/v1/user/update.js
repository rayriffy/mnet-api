import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.put('/', async (req, res) => {
  try {
    let user = await User.getUserById(req.user.id)

    let payload = user.profile

    if (req.body.profile) {
      if (req.body.profile.fullname) payload.fullname = req.body.profile.fullname
      if (req.body.profile.school) {
        if (req.body.profile.school.generation) payload.school.generation = req.body.profile.school.generation
        if (req.body.profile.school.room) payload.school.room = req.body.profile.school.room
      }
      if (req.body.profile.notification) {
        if (req.body.profile.notification.id) payload.notification.id = req.body.profile.notification.id
        if (req.body.profile.notification.group) payload.notification.group = req.body.profile.notification.group
      }
    }

    let operation = await User.updateUserProfile(req.user.id, payload)

    if (operation.n === 0) {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'user not found',
          data: operation,
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
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'user not found',
        },
      })
    } else {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    }
  }
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
