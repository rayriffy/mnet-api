import express from 'express'

import Announce from '../../../models/announce'
import User from '../../../models/user'

const router = express.Router()

router.post('/', (req, res, next) => {
  User.getUserById(req.user.id, (err, user) => {
    if (err) {
      res.status(404).send({
        status: 'failure',
        response: {
          message: 'id not found',
        },
      })
    } else {
      if (user.role !== 'administrator') {
        res.status(401).send({
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

router.post('/', (req, res) => {
  const payload = {
    message: req.body.message,
  }

  Announce.addAnnounce(payload, (err, announce) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'failed to create new group',
          data: err,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        response: {
          message: 'announce created',
          data: {
            group: {
              id: announce._id,
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
