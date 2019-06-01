import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
})

NotificationSchema.static.addGroup = async data => {
  return data.save()
}

NotificationSchema.static.getNotificationGroupById = async id => {
  return Notification.findById(id)
}

const Notification = mongoose.model('Notification', NotificationSchema)

export default Notification
