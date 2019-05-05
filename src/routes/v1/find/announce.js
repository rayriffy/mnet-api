import _ from 'lodash'
import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.post('/regex', async (req, res) => {
  console.log(req.body)
  if (_.isEmpty(req.body.regex)) {
    return res.send(400).send({
      status: 'failure',
      code: 702,
      response: {
        message: 'provided data is not enough',
      },
    })
  }

  if (!_.isRegExp(new RegExp(req.body.regex))) {
    return res.send(400).send({
      status: 'failure',
      code: 708,
      response: {
        message: 'invalid regex expression',
      },
    })
  }

  try {
    const reg = new RegExp(req.body.regex)
    let announces = await Announce.find({
      $or: [{'message.title': {$regex: reg}}, {'message.body': {$regex: reg}}],
    })

    if (_.isEmpty(announces)) {
      return res.status(404).send({
        status: 'failure',
        code: 704,
        response: {
          message: 'announce not found',
        },
      })
    } else {
      let promises = []
      let announcesResponse = []

      const fetchAnnounce = async announce => {
        let doc = await Announce.find({$and: [{like: {$in: [req.user.id]}}, {_id: {$eq: announce._id}}]})

        return announcesResponse.push({
          id: announce._id,
          date: announce.date,
          message: announce.message,
          from: announce.from,
          to: announce.to,
          like: {
            count: _.isNumber(announce.like.length) ? announce.like.length : 0,
            isLike: !_.isEmpty(doc),
          },
        })
      }

      _.each(announces, announce => {
        promises.push(fetchAnnounce(announce))
      })

      console.log(promises)

      await Promise.all(promises)

      return res.status(200).send({
        status: 'success',
        code: 201,
        response: {
          message: 'announces data recived',
          data: {
            announces: announcesResponse,
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

router.all('/regex', (req, res) => {
  res.status(405).send({
    status: 'failure',
    code: 705,
    response: {
      message: 'invalid method',
    },
  })
})

export default router
