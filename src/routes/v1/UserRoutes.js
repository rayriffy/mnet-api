import express from 'express'

import userProfile from './user/profile'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from user',
  })
})

router.use('/profile', userProfile)

export default router
