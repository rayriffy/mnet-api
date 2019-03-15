import _ from 'lodash'
import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.post('/add/:id', async (req, res) => {
  let operation = await Announce.findByIdAndUpdate(req.params.id, {$addToSet: {like: req.user.id}})

  if (_.isEmpty(operation)) {
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
        message: 'you liked this announce',
      },
    })
  }
})

router.delete('/remove/:id', async (req, res) => {
  let operation = await Announce.findByIdAndUpdate(req.params.id, {$pull: {like: req.user.id}})

  if (_.isEmpty(operation)) {
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
        message: 'you unliked this announce',
      },
    })
  }
})

router.get('/count/:id', async (req, res) => {
  let announce = await Announce.findById(req.params.id)

  if (_.isEmpty(announce)) {
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
        message: 'counted this announce',
        data: {
          count: _.isNumber(announce.like.length) ? announce.like.length : 0,
        },
      },
    })
  }
})

router.get('/islike/:id', async (req, res) => {
  let announce = await Announce.findById(req.params.id)

  if (_.isEmpty(announce)) {
    return res.status(404).send({
      status: 'failure',
      code: 704,
      response: {
        message: 'announce not found',
      },
    })
  } else {
    let doc = await Announce.find({$and: [{like: {$in: [req.user.id]}}, {_id: {$eq: announce._id}}]})

    return res.status(200).send({
      status: 'success',
      code: 201,
      response: {
        message: 'here is the result',
        data: {
          id: announce._id,
          isLike: !_.isEmpty(doc),
        },
      },
    })
  }
})

router.all('*', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
