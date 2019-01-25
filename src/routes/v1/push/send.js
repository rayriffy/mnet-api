import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  let data = req.body
  console.log(data)
  res.status(200).send({
    status: 'success',
    response: 'this api will use to send notification to devices',
  })
})

export default router
