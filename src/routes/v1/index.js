import express from 'express'

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

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

router.use('/announce', AnnounceRoutes)
router.use('/auth', AuthRoutes)
router.use('/push', PushRoutes)
router.use('/user', UserRoutes)

export default router
