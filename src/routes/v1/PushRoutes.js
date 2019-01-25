import express from 'express'

import pushSend from './push/send'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from push',
  })
})

router.use('/send', pushSend)

export default router
