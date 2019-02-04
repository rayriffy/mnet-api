import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import pushSend from './push/send'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'hi from push',
    },
  })
})

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

router.use(authenticationMiddleware)

router.use('/send', pushSend)

export default router
