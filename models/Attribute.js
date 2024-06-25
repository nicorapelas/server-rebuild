const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AttributeSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  attribute: {
    type: String,
    required: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Attribute', AttributeSchema)
