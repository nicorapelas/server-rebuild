const mongoose = require('mongoose')
const Schema = mongoose.Schema

const EmployHistorySchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  company: {
    type: String,
    required: true
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  current: {
    type: Boolean,
    default: false
  },
  startDateValue: {
    type: String
  },
  position: {
    type: String
  },
  description: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('EmployHistory', EmployHistorySchema)
