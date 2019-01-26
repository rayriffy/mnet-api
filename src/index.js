import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'

import dbConfig from './config/database'
import passportService from './services/passport'
import serverConfig from './config/server'

import v1Routes from './routes/v1/index'

const {PORT = 3000} = serverConfig

mongoose.connect(dbConfig.database, {useMongoClient: true})

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
