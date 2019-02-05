import express from 'express'

import invalidMethodMiddleware from '../../../middlewares/v1/invalidMethodMiddleware'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', (req, res) => {
  Group.getGroupById(req.body.id, (err, group) => {
    if (err) {
      return res.status(400).send({
        status: 'failure',
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    } else {
      if (group) {
        const payload = {
          group: {
            id: group._id,
          },
          user: {
            id: req.user.id,
          },
        }
        Group.addUserToGroup(payload, (err, data) => {
          if (err) {
            return res.status(400).send({
              status: 'failure',
              response: {
                message: 'unexpected error',
                data: err,
              },
            })
          } else {
            return res.status(200).send({
              status: 'success',
              response: {
                message: 'group joined',
                data: {
                  group: {
                    id: group._id,
                  },
                },
              },
            })
          }
        })
      } else {
        return res.status(404).send({
          status: 'failure',
          response: {
            message: 'group not found',
          },
        })
      }
    }
  })
})

router.use('/', invalidMethodMiddleware)

export default router
