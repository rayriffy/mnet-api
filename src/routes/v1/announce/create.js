import express from 'express'
import _ from 'lodash'

import notifyService from '../../../services/notify'

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
    to: req.body.to,
  }

  Announce.addAnnounce(payload, (err, announce) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'failed to create new announce',
          data: err,
        },
      })
    } else {
      _.each(req.body.to, to => {
        notifyService(to, 'ประกาศ!', announce.message)
      })
      return res.status(202).send({
        status: 'success',
        response: {
          message: 'announce created and being notified to specified users',
          data: {
            message: {
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
