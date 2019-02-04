import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import userIndex from './user/index'
import userProfile from './user/profile'

const router = express.Router()

router.get('/', userIndex)

router.use(authenticationMiddleware)

router.use('/profile', userProfile)

export default router
