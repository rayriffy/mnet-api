import express from 'express'
import passport from 'passport'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
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
        // TODO: JOIN
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
