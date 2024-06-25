const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deviceBrand: {
    type: String
  },
  deviceModelName: {
    type: String
  },
  deviceName: {
    type: String
  },
  isDevice: {
    type: Boolean
  },
  osBuildId: {
    type: String
  },
  osInternalBuildId: {
    type: String
  },
  osVersion: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Device', DeviceSchema)
