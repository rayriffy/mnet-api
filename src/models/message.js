import moment from 'moment'
import mongoose from 'mongoose'

const MessageSchema = mongoose.Schema({
  group: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: moment(),
  },
  message: {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    relatedMessage: {
      type: String,
      required: true,
      trim: true,
      default: null,
    },
  },
  like: {
    type: Array,
    required: true,
    default: [],
  },
})

MessageSchema.statics.addMessage = async data => {
  return data.save()
}

MessageSchema.statics.getMessageById = async id => {
  return Message.findById(id)
}

MessageSchema.statics.getRelatedMessageById = async id => {
  return Message.find({message: {relatedMessage: id}})
}

const Message = mongoose.model('Message', MessageSchema)

export default Message
