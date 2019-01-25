import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  user: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  pass: {
    type: String,
    required: true,
  },
})

UserSchema.statics.authenticate = (user, pass, callback) => {
  User.findOne({user: user}).exec((err, res) => {
    if (err) {
      return callback(err)
    } else if (!res) {
      let err = new Error('User not found.')
      err.status = 401
      return callback(err)
    }
    bcrypt.compare(pass, res.pass, (err, res) => {
      if (res === true) {
        return callback(null, this.res)
      } else {
        return callback(err)
      }
    })
  })
}

UserSchema.pre('save', function(next) {
  var user = this
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  })
})

const User = mongoose.model('User', UserSchema)

export default User
