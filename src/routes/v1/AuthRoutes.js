import express from 'express'

import authActivate from './auth/activate'
import authCreate from './auth/create'
import authIndex from './auth/index'
import authLogin from './auth/login'

const router = express.Router()

router.use('/', authIndex)
router.use('/activate', authActivate)
router.use('/create', authCreate)
router.use('/login', authLogin)

export default router
