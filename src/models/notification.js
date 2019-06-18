import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
})

NotificationSchema.static.addGroup = async data => {
  const Notification = mongoose.model('Announce', NotificationSchema)
  const payload = new Notification(data)

  return payload.save()
}

NotificationSchema.static.getNotificationGroupById = async id => {
  return Notification.findById(id)
}

const Notification = mongoose.model('Notification', NotificationSchema)

export default Notification
