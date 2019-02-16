import express from 'express'

import Announce from '../../../models/announce'
import User from '../../../models/user'

const router = express.Router()

router.delete('/:id', (req, res, next) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'user not found',
        },
      })
    } else {
      if (user.authentication.role !== 'administrator') {
        res.status(401).send({
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
})

router.delete('/:id', (req, res) => {
  Announce.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'announce not found',
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'announce sucessfully deleted',
        },
      })
    }
  })
})

router.all('/:id', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
