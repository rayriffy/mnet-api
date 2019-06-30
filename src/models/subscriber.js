import _ from 'lodash'
import mongoose from 'mongoose'
import Expo from 'expo-server-sdk'

const SubscriberSchema = new mongoose.Schema({
	group: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		trim: true,
	},
	user: {
		token: {
			type: String,
			required: true,
			trim: true,
		},
		id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			trim: true
		}
	},
})

SubscriberSchema.statics.getSubscriberByGroup = async group => {
	return Subscriber.find({ group: { $eq: group } })
}

<<<<<<< HEAD
SubscriberSchema.statics.subscribe = async (groupId, expoToken, userId) => {
	if (!Expo.isExpoPushToken(expoToken)) {
		throw Error('invalid notification token format')
	}
	else {
		const dups = await Subscriber.find({ $and: [{ group: { $eq: groupId }, 'user.token': { $eq: expoToken }  }] })
		if (!_.isEmpty(dups)) {
			throw Error('the user has already been subscribed to the group')
		} else {
			const data = new Subscriber({
				group: groupId,
				user: {
					token: expoToken,
					id: userId
				}
			})
			return data.save()
		}
	}
=======
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
>>>>>>> ccbe0364a2add6673eeef01ecf43c32a4ed2090b
}

SubscriberSchema.statics.unsubscribe = async (group, token) => {
	return Subscriber.deleteOne({ $and: [{ group: { $eq: group } }, { token: { $eq: token } }] })
}

const Subscriber = mongoose.model('Subscriber', SubscriberSchema)

export default Subscriber
