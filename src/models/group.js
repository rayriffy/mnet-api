import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  member: {
    type: Array,
    required: true,
    default: [],
  },
})

GroupSchema.statics.addGroup = (data, callback) => {
  data.save(callback)
}

GroupSchema.statics.getGroupById = (id, callback) => {
  Group.findById(id, callback)
}

GroupSchema.statics.addUserToGroup = (data, callback) => {
  Group.findById(data.group.id, (err, group) => {
    if (err) {
      callback(err)
    } else {
      Group.findByIdAndUpdate(group._id, {$push: {member: data.user.id}}, (err, res) => {
        if (err) {
          callback(err)
        } else {
          callback(null, res)
        }
      })
    }
  })
}

const Group = mongoose.model('Group', GroupSchema)

export default Group
