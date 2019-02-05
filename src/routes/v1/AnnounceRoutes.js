import express from 'express'

import announceIndex from './announce/index'

const router = express.Router()

router.use('/', announceIndex)

export default router
