import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  authentication: {
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
    role: {
      type: String,
      required: true,
      default: 'normal',
    },
  },
  activation: {
    ref: {
      type: String,
      required: true,
    },
    isActivated: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  profile: {
    fullname: {
      type: String,
      required: true,
    },
    school: {
      generation: {
        type: Number,
        required: true,
        default: 0,
      },
      room: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  },
})

UserSchema.statics.addUser = (data, callback) => {
  bcrypt.hash(data.authentication.pass, 10, (err, res) => {
    if (err) {
      callback(err)
    }
    data.authentication.pass = res
    data.save(callback)
  })
}

UserSchema.statics.activateUser = (ref, callback) => {
  User.updateOne(
    {$and: [{'activation.ref': {$eq: ref}}, {'activation.isActivated': {$eq: false}}]},
    {$set: {activation: {isActivated: true}}},
    callback,
  )
}

UserSchema.statics.updateUserProfile = (id, payload, callback) => {
  User.findByIdAndUpdate(id, {$set: {profile: payload}}, callback)
}

UserSchema.statics.getUserById = (id, callback) => {
  User.findById(id, callback)
}

UserSchema.statics.getUserByUsername = (user, callback) => {
  User.findOne({'authentication.user': {$eq: user}}, callback)
}

UserSchema.statics.comparePassword = (candidatePassword, hash, callback) => {
  bcrypt.compare(candidatePassword, hash, (err, res) => {
    if (res === true) {
      callback(null, res)
    } else {
      callback(err)
    }
  })
}

UserSchema.static.changePassword = (id, oldPassword, newPassword, callback) => {
  User.getUserById(id, (err, user) => {
    if (err || !user) {
      callback(null, false)
    } else {
      User.comparePassword(oldPassword, user.pass, (err, compare) => {
        if (err) {
          callback(err)
        }
        if (compare) {
          bcrypt.hash(newPassword, 10, (err, res) => {
            if (err) {
              callback(err)
            }
            User.findByIdAndUpdate(id, {$set: {pass: res}}, (err, res) => {
              if (err) {
                callback(err)
              } else {
                callback(null, res)
              }
            })
          })
        } else {
          callback(null, false)
        }
      })
    }
  })
}

const User = mongoose.model('User', UserSchema)

export default User
