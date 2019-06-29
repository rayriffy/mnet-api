import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
})

NotificationSchema.statics.addGroup = function(data) {
  const Noti = mongoose.model('Notification', NotificationSchema)
  const payload = new Noti(data)
  return payload.save()
}

NotificationSchema.statics.getNotificationGroupById = async id => {
  return Notification.findById(id)
}

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
