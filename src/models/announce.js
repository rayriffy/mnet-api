import _ from 'lodash'
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

AnnounceSchema.statics.addAnnounce = async data => {
  const Announce = mongoose.model('Announce', AnnounceSchema)
  const payload = new Announce(data)

  return payload.save()
}

AnnounceSchema.statics.getAnnounceById = async id => {
  return Announce.findOne({_id: {$eq: id}})
}

AnnounceSchema.statics.countLikeById = async id => {
  const announce = await Announce.findById(id)

  if (_.isEmpty(announce)) {
    return false
  } else {
    return announce.like.length
  }
}

const Announce = mongoose.model('Announce', AnnounceSchema)

export default Announce
