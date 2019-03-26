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
    new Strategy(opts, async (payload, res) => {
      try {
        let user = await User.getUserById(payload.id)

        if (user) {
          return res(null, user)
        } else {
          return res(null, false)
        }
      } catch (err) {
        return res(err, null)
      }
    }),
  )
}
