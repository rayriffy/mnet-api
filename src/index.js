import bodyParser from 'body-parser'
import chalk from 'chalk'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'

import passportService from './services/passport'

import v1Routes from './routes/v1/index'

dotenv.config()
const {PORT = 3000, MONGO_DATABASE, NODE_ENV} = process.env

mongoose.connect(MONGO_DATABASE, {useCreateIndex: true, useNewUrlParser: true})

mongoose.connection.on('connected', () => {
  console.log(`${chalk.black.bgGreen(' INFO ')} connected to the database`)
})

mongoose.connection.on('error', err => {
  console.log(`${chalk.black.bgRed(' FAIL ')} cannot connect to the database: ${err}`)
})

const server = express()

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({extended: true}))

server.use(cors())

server.use(passport.initialize())
server.use(passport.session())
passportService(passport)

server.use('/api/v1', v1Routes)

server.all('*', (req, res) => {
  res.status(404).send({
    status: 'failure',
    response: 'route not found',
  })
})

server.listen(PORT, () => {
  console.log(`${chalk.black.bgGreen(' INFO ')} app is running on port ${PORT}`)
  if (NODE_ENV !== 'production') {
    console.log(`${chalk.black.bgYellow(' WARN ')} this app is running on ${NODE_ENV} environment!`)
  }
})
