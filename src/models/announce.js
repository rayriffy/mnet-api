import mongoose from 'mongoose'

const AnnounceSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  message: {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
  from: {
    type: Array,
    required: true,
  },
  to: {
    type: Array,
    required: true,
    default: [],
  },
  like: {
    type: Array,
    required: true,
    default: [],
  },
})

AnnounceSchema.statics.addAnnounce = (data, callback) => {
  const Announce = mongoose.model('Announce', AnnounceSchema)
  const payload = new Announce(data)
  payload.save(callback)
}

AnnounceSchema.statics.getAnnounceById = (id, callback) => {
  Announce.findById(id, callback)
}

AnnounceSchema.statics.countLikeById = (id, callback) => {
  Announce.findById(id, callback, (err, announce) => {
    if (err) {
      callback(err)
    } else {
      if (!announce) {
        callback(null, false)
      } else {
        callback(null, announce.like.length)
      }
    }
  })
}

const Announce = mongoose.model('Announce', AnnounceSchema)

export default Announce
