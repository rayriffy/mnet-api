import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.put('/', async (req, res) => {
  let user = await User.getUserById(req.user.id)

  let payload = user.profile

  if (req.body.profile) {
    if (req.body.profile.fullname) payload.fullname = req.body.profile.fullname
    if (req.body.profile.school) {
      if (req.body.profile.school.generation) payload.school.generation = req.body.profile.school.generation
      if (req.body.profile.school.room) payload.school.room = req.body.profile.school.room
    }
  }

  let operation = await User.updateUserProfile(req.user.id, payload)

  if (operation.n === 0) {
    return res.status(404).send({
      status: 'failure',
      code: 704,
      response: {
        message: 'user id is not found',
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
