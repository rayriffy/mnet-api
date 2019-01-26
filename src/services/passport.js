import dotenv from 'dotenv'
import {ExtractJwt, Strategy} from 'passport-jwt'

import User from '../models/user'

dotenv.config()
const {SECRET} = process.env

export default passport => {
  let opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt')
  opts.secretOrKey = SECRET
  passport.use(
    new Strategy(opts, (payload, res) => {
      User.getUserById(payload.id, (err, user) => {
        if (err) {
          return res(null, false)
        }

        if (user) {
          return res(null, user)
        } else {
          return res(null, false)
        }
      })
    }),
  )
}
