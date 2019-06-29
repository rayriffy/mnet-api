import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  }
})

NotificationSchema.statics.addGroup = function(data) {
  const noti = mongoose.model('Notification', NotificationSchema)
  const payload = new noti(data)
  return payload.save()
}

NotificationSchema.statics.getNotificationGroupById = async id => {
  return Notification.findById(id)
}

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
