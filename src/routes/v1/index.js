import express from 'express'

import AuthRoutes from './AuthRoutes'

const router = express.Router()

router.use('/auth', AuthRoutes)

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'healthy',
  })
})

export default router
