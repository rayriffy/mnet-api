import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import likeIndex from './like/index'
import likeAnnounce from './like/announce'

const router = express.Router()

router.use('/', likeIndex)

router.use(authenticationMiddleware)

router.use('/announce', likeAnnounce)

export default router
