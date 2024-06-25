const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContactInfoSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  phone: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  unit: {
    type: String
  },
  complex: {
    type: String
  },
  address: {
    type: String
  },
  suburb: {
    type: String
  },
  city: {
    type: String
  },
  province: {
    type: String
  },
  country: {
    type: String
  },
  postalCode: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('ContactInfo', ContactInfoSchema)
