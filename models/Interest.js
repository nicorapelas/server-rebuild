const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InterestSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  interest: {
    type: String,
    required: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Interest', InterestSchema)
