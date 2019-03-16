import _ from 'lodash'
import express from 'express'

import User from '../../../models/user'

const router = express.Router()

router.get('/:id/full', async (req, res) => {
  let user = await User.getUserById(req.params.id)

  if (_.isEmpty(user)) {
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
        message: 'user data recived',
        data: {
          user: {
            id: user._id,
            authentication: {
              user: user.authentication.user,
              role: user.authentication.role,
            },
            activation: user.activation,
            profile: {
              fullname: user.profile.fullname,
              school: user.profile.school,
            },
          },
        },
      },
    })
  }
})

router.get('/:id/min', async (req, res) => {
  try {
    let user = await User.findById(req.params.id)
      .select({'authentication.user': 1, 'profile.fullname': 1, _id: 1})
      .exec()

    if (_.isEmpty(user)) {
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
          message: 'user data recived',
          data: {
            user: {
              id: user._id,
              authentication: {
                user: user.authentication.user,
              },
              profile: {
                fullname: user.profile.fullname,
              },
            },
          },
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

router.all('*', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
