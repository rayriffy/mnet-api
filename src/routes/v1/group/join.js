import express from 'express'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', (req, res) => {
  Group.getGroupById(req.body.id, (err, group) => {
    if (err) {
      return res.status(401).send({
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
            return res.status(401).send({
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
        return res.status(401).send({
          status: 'failure',
          response: {
            message: 'group not found',
          },
        })
      }
    }
  })
})

export default router
