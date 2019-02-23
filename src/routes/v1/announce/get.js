import express from 'express'

import Announce from '../../../models/announce'

const router = express.Router()

router.get('/:id', (req, res) => {
  Announce.getAnnounceById(req.params.id, (err, announce) => {
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
            message: 'announce data recived',
            data: {
              announce: {
                id: announce._id,
                date: announce.date,
                message: announce.message,
                from: announce.from,
                to: announce.to,
              },
            },
          },
        })
      }
    }
  })
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
