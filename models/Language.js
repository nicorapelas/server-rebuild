const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LanguageSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  language: {
    type: String,
    required: true
  },
  read: {
    type: Number
  },
  write: {
    type: Number
  },
  speak: {
    type: Number
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Language', LanguageSchema)
