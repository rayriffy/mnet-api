import _ from 'lodash'
import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    let announce = await Announce.getAnnounceById(req.params.id)

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
          message: 'announce data recived',
          data: {
            announce: {
              id: announce._id,
              date: announce.date,
              message: announce.message,
              from: announce.from,
              to: announce.to,
              like: {
                count: _.isNumber(announce.like.length) ? announce.like.length : 0,
                isLike: !_.isEmpty(doc),
              },
            },
          },
        },
      })
    }
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'announce not found',
        },
      })
    } else {
      return res.status(400).send({
        status: 'failure',
        code: 701,
        response: {
          message: 'unexpected error',
          data: err,
        },
      })
    }
  }
})

router.all('/:id', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
