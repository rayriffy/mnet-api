import express from 'express'

import AnnounceRoutes from './AnnounceRoutes'
import AuthRoutes from './AuthRoutes'
import PushRoutes from './PushRoutes'
import UserRoutes from './UserRoutes'

const router = express.Router()

router.use('/announce', AnnounceRoutes)
router.use('/auth', AuthRoutes)
router.use('/push', PushRoutes)
router.use('/user', UserRoutes)

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'healthy',
  })
})

export default router
