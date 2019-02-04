import express from 'express'

import authenticationMiddleware from '../../middlewares/v1/authenticationMiddleware'

import groupCreate from './group/create'
import groupJoin from './group/join'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from group',
  })
})

router.use(authenticationMiddleware)

router.use('/create', groupCreate)
router.use('/join', groupJoin)

export default router
