import express from 'express'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', (req, res) => {
  Group.getGroupById(req.body.id, (err, group) => {
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
              code: 701,
              response: {
                message: 'unexpected error',
                data: err,
              },
            })
          } else {
            return res.status(200).send({
              status: 'success',
              code: 201,
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
          code: 704,
          response: {
            message: 'group not found',
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
