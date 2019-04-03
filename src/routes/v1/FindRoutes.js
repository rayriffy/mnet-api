import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import findIndex from './find/index'
import findAnnounce from './find/announce'

const router = express.Router()

router.use('/', findIndex)

router.use(authenticationMiddleware)

router.use('/announe', findAnnounce)

export default router
