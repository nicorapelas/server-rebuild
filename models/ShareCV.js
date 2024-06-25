const mongoose = require('mongoose')
const RecipientSchema = require('./Recipient')
const Schema = mongoose.Schema

const ShareCvSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  curriculumVitaeID: {
    type: String
  },
  assignedPhotoUrl: {
    type: String
  },
  recipients: [RecipientSchema],
  yes: {
    type: Number,
    default: 0
  },
  no: {
    type: Number,
    default: 0
  },
  lastResponded: {
    type: Date
  },
  dateSent: {
    type: Date,
    default: Date.now
  }
})

module.exports = ShareCV = mongoose.model('ShareCV', ShareCvSchema)
