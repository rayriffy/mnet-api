import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import pushSend from './push/send'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from push',
  })
})

router.use(authenticationMiddleware)

router.use('/send', pushSend)

export default router
