import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    code: 201,
    response: {
      message: 'hi from notification',
    },
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
