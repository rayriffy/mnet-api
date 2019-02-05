import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import announceCreate from './announce/create'
import announceIndex from './announce/index'

const router = express.Router()

router.use('/', announceIndex)

router.use(authenticationMiddleware)

router.use('/create', announceCreate)

export default router
