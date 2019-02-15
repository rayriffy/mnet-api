import express from 'express'
import _ from 'lodash'

import Announce from '../../../models/announce'

const router = express.Router()

router.get('/:page', (req, res) => {
  Announce.find()
    .select('_id')
    .sort({date: 'desc'})
    .limit(10)
    .skip(10 * (req.params.page - 1))
    .exec((err, announces) => {
      if (err) {
        return res.status(400).send({
          status: 'failure',
          code: 701,
          response: {
            message: 'unexpected error',
            data: err,
          },
        })
      }
      let payload = []
      _.each(announces, announce => {
        payload.push(announce._id)
      })
      if (_.isEmpty(payload)) {
        return res.status(404).send({
          status: 'failure',
          code: 704,
          response: {
            message: 'you reached the limit :(',
          },
        })
      } else {
        return res.status(200).send({
          status: 'success',
          code: 201,
          response: {
            message: 'announces data recived',
            data: {
              announce: payload,
            },
          },
        })
      }
    })
})

router.all('/:page', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
