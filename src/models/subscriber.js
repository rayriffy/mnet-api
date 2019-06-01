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

SubscriberSchema.static.getSubscriberByGroup = async group => {
  return Subscriber.find({group: {$eq: group}})
}

SubscriberSchema.static.subscribe = async (group, token) => {
  const payload = {
    group: group,
    token: token,
  }

  // Check dups
  const dups = await Subscriber.find({$and: [{group: {$eq: group}}, {token: {$eq: token}}]})

  if (!_.isEmpty(dups)) {
    return false
  } else {
    return payload.save()
  }
}

SubscriberSchema.static.unsubscribe = async (group, token) => {
  return Subscriber.deleteOne({$and: [{group: {$eq: group}}, {token: {$eq: token}}]})
}

const Subscriber = mongoose.model('Subscriber', SubscriberSchema)

export default Subscriber
