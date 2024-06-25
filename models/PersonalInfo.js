const mongoose = require('mongoose')
const Schema = mongoose.Schema

const personalInfoSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  fullName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String
  },
  idNumber: {
    type: String
  },
  gender: {
    type: String
  },
  saCitizen: {
    type: Boolean,
    default: false
  },
  ppNumber: {
    type: String
  },
  nationality: {
    type: String
  },
  driversLicense: {
    type: Boolean,
    default: false
  },
  licenseCode: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('PersonalInfo', personalInfoSchema)
