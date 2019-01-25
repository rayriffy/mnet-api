import express from 'express'

import authCreate from './auth/create'
import authLogin from './auth/login'
import authLogout from './auth/logout'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from auth',
  })
})

router.use('/create', authCreate)
router.use('/login', authLogin)
router.use('/logout', authLogout)

export default router
