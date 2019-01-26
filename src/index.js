import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'

import passportService from './services/passport'

import v1Routes from './routes/v1/index'

dotenv.config()
const {PORT = 3000, MONGO_DATABASE} = process.env

mongoose.connect(MONGO_DATABASE, {useCreateIndex: true, useNewUrlParser: true})

mongoose.connection.on('connected', () => {
  console.log('connected to the database')
})

mongoose.connection.on('error', err => {
  console.log(`cannot connect to the database: ${err}`)
})

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.use(cors())

server.use(passport.initialize())
server.use(passport.session())
passportService(passport)

server.use('/api/v1', v1Routes)

server.get('*', (req, res) => {
  res.status(404).send({
    status: 'failure',
    response: 'route not found',
  })
})

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`)
})
