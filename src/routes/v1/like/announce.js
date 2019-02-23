import _ from 'lodash'
import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.post('/add/:id', (req, res) => {
  Announce.findByIdAndUpdate(req.params.id, {$addToSet: {like: req.user.id}}, (err, doc) => {
    if (err) {
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
    } else {
      if (!doc) {
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
    }
  })
})

router.delete('/remove/:id', (req, res) => {
  Announce.findByIdAndUpdate(req.params.id, {$pull: {like: req.user.id}}, (err, doc) => {
    if (err) {
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
    } else {
      if (!doc) {
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
    }
  })
})

router.get('/count/:id', (req, res) => {
  Announce.findById(req.params.id, (err, announce) => {
    if (err) {
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
    } else {
      if (!announce) {
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
    }
  })
})

router.get('/islike/:id', (req, res) => {
  Announce.findById(req.params.id, (err, announce) => {
    if (err) {
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
    } else {
      if (!announce) {
        return res.status(404).send({
          status: 'failure',
          code: 704,
          response: {
            message: 'announce not found',
          },
        })
      } else {
        Announce.find({$and: [{like: {$in: [req.user.id]}}, {_id: {$eq: announce._id}}]}, (err, doc) => {
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
                message: 'here is the result',
                data: {
                  id: announce._id,
                  isLike: !_.isEmpty(doc),
                },
              },
            })
          }
        })
      }
    }
  })
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
