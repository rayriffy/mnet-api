import express from 'express'

import invalidMethodMiddleware from '../../../middlewares/v1/invalidMethodMiddleware'

import Group from '../../../models/group'

const router = express.Router()

router.post('/', (req, res) => {
  const payload = {
    name: req.body.name,
    owner: req.user.id,
  }
  Group.addGroup(payload, (err, group) => {
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
          message: 'group created',
          data: {
            group: {
              id: group._id,
            },
          },
        },
      })
    }
  })
})

router.use('/', invalidMethodMiddleware)

export default router
