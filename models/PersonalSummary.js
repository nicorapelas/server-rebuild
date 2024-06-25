const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSummarySchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: true,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
})

mongoose.model('PersonalSummary', PersonalSummarySchema)
