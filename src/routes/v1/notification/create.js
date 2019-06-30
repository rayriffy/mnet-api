import _ from 'lodash'
import express from 'express'

import Notification from '../../../models/notification'
const router = express.Router()

router.post('/', (req, res, next) => {
  if (!req.body.groupName) {
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

<<<<<<< HEAD
router.post('/', async (req, res) => {
  const payload = {
    name: req.body.groupName,
    owner: req.user.id
=======
router.post('/', async (req, res, next) => {
  const {name} = req.body
  const groups = await Notification.find({name: {$eq: name.trim()}})

  if (!_.isEmpty(groups)) {
    return res.status(400).send({
      status: 'failure',
      code: 709,
      response: {
        message: 'duplicated name',
      },
    })
  } else {
    next()
  }
})

router.post('/', async (req, res) => {
  const {name} = req.body
  const groupId = Math.random()
    .toString(36)
    .substr(2, 8)

  const payload = {
    name: name.trim(),
    id: groupId,
>>>>>>> ccbe0364a2add6673eeef01ecf43c32a4ed2090b
  }
  console.log(payload)
  try {
    const group = await Notification.addGroup(payload)
    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'notification group created',
        data: {
          groupRef: group.groupRef,
          name: group.name,
        },
      },
    })
  } catch (err) {
    console.log(err)
    return res.status(400).send({
      status: 'failure',
      code: 701,
      response: {
        message: 'unexpected error',
        data: err.message,
        name: req.body,
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
