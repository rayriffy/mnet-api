import express from 'express'

import authActivate from './auth/activate'
import authCreate from './auth/create'
import authLogin from './auth/login'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from auth',
  })
})

router.use('/activate', authActivate)
router.use('/create', authCreate)
router.use('/login', authLogin)

export default router
