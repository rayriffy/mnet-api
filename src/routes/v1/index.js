import express from 'express'

import invalidMethodMiddleware from '../../middlewares/v1/invalidMethodMiddleware'

import AnnounceRoutes from './AnnounceRoutes'
import AuthRoutes from './AuthRoutes'
import PushRoutes from './PushRoutes'
import UserRoutes from './UserRoutes'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'healthy',
    },
  })
})

router.use('/', invalidMethodMiddleware)

router.use('/announce', AnnounceRoutes)
router.use('/auth', AuthRoutes)
router.use('/push', PushRoutes)
router.use('/user', UserRoutes)

export default router
