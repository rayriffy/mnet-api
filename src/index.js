import bodyParser from 'body-parser'
import express from 'express'

import v1Routes from './routes/v1/index'

const {PORT = 3000} = process.env

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.use('/api/v1', v1Routes)

server.get('*', (req, res) => {
  res.status(404).send({
    status: 'failure',
    response: 'route not found',
  })
})

server.listen(PORT)
