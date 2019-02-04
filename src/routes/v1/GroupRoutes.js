import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import groupCreate from './group/create'
import groupJoin from './group/join'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: {
      message: 'hi from group',
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

router.use('/create', groupCreate)
router.use('/join', groupJoin)

export default router
