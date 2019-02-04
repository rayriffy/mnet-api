import mongoose from 'mongoose'

const AnnounceSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  message: {
    body: {
      type: String,
      required: true,
      trim: true,
    },
  },
})

AnnounceSchema.statics.addAnnounce = (data, callback) => {
  data.save(callback)
}

AnnounceSchema.statics.getAnnounceById = (id, callback) => {
  Announce.findById(id, callback)
}

const Announce = mongoose.model('Announce', AnnounceSchema)

export default Announce
