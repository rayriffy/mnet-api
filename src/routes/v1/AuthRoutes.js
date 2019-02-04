import express from 'express'

import authActivate from './auth/activate'
import authCreate from './auth/create'
import authLogin from './auth/login'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'hi from auth',
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

router.use('/activate', authActivate)
router.use('/create', authCreate)
router.use('/login', authLogin)

export default router
