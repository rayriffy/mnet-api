import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send({
    status: 'success',
    response: 'hi from announce',
  })
})

export default router
