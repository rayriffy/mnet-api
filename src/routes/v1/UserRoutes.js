import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import userProfile from './user/profile'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'hi from user',
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

router.use(authenticationMiddleware)

router.use('/profile', userProfile)

export default router
