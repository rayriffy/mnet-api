import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import userIndex from './user/index'
import userProfile from './user/profile'
import userUpdate from './user/update'

const router = express.Router()

router.get('/', userIndex)

router.use(authenticationMiddleware)

router.use('/profile', userProfile)
router.use('/update', userUpdate)

export default router
