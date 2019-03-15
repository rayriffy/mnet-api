import _ from 'lodash'
import express from 'express'
import passport from 'passport'

import User from '../../../models/user'

const router = express.Router()

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  let user = await User.getUserById(req.user.id)

  if (_.isEmpty(user)) {
    return res.status(404).send({
      status: 'failure',
      code: 704,
      response: {
        message: 'user not found',
      },
    })
  } else {
    if (user.authentication.role !== 'administrator') {
      return res.status(401).send({
        code: 707,
        status: 'failure',
        response: {
          message: 'insufficient permission',
        },
      })
    } else {
      next()
    }
  }
})

router.post('/', (req, res, next) => {
  if (!req.body.activation || !req.body.activation.ref) {
    res.status(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'provided data is not enough',
      },
    })
  } else {
    next()
  }
})

router.post('/', async (req, res) => {
  let activation = await User.activateUser(req.body.activation.ref)

  if (activation.n === 0) {
    return res.status(404).send({
      status: 'failure',
      code: 704,
      response: {
        message: 'ref code is not found',
        data: activation,
      },
    })
  } else {
    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'user activated',
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
