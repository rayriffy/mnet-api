import express from 'express'

import AuthenticationMiddleware from '../../middlewares/v1/AuthenticationMiddlewares'

const router = express.Router()

router.get('/', AuthenticationMiddleware, (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from auth',
  })
})

export default router
