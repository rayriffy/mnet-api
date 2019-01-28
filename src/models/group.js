import mongoose from 'mongoose'

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
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
  Group.findByIdAndUpdate(data.group.id, {$push: {member: data.user.id}}, callback)
}

const Group = mongoose.model('Group', GroupSchema)

export default Group
