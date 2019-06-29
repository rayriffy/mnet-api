import _ from 'lodash'
import mongoose from 'mongoose'

const SubscriberSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
    trim: true,
  },
})

SubscriberSchema.statics.getSubscriberByGroup = async group => {
  return Subscriber.find({group: {$eq: group}})
}

SubscriberSchema.statics.subscribe = async (group, token) => {
  const payload = {
    group: group,
    token: token,
  }

  // Check dups
  const dups = await Subscriber.find({$and: [{group: {$eq: group}}, {token: {$eq: token}}]})

  if (!_.isEmpty(dups)) {
    return false
  } else {
    const Sub = mongoose.model('Subscriber', SubscriberSchema)
    const data = new Sub(payload)
    return data.save()
  }
}

SubscriberSchema.statics.unsubscribe = async (group, token) => {
  return Subscriber.deleteOne({$and: [{group: {$eq: group}}, {token: {$eq: token}}]})
}

const Subscriber = mongoose.model('Subscriber', SubscriberSchema)

export default Subscriber
