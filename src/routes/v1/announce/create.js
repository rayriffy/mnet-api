import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  
})

router.all('/', (req, res) => {
  res.status(405).send({
    status: 'failure',
    response: {
      message: 'invalid method',
    },
  })
})

export default router
