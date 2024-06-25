const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReferenceSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 14,
  },
  email: {
    type: String,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
})

mongoose.model('Reference', ReferenceSchema)
