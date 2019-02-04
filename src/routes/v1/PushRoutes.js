import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import pushIndex from './push/index'
import pushSend from './push/send'

const router = express.Router()

router.use('/', pushIndex)

router.use(authenticationMiddleware)

router.use('/send', pushSend)

export default router
