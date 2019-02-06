import express from 'express'

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
        code: 701,
        response: {
          message: 'failed to create new group',
          data: err,
        },
      })
    } else {
      return res.status(200).send({
        status: 'success',
        code: 201,
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
