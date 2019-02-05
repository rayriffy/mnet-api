import express from 'express'

import invalidMethodMiddleware from '../middlewares/v1/invalidMethodMiddleware'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'hello',
    },
  })
})

router.use('/', invalidMethodMiddleware)

export default router
