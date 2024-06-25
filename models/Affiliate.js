const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AffiliateSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  code: {
    type: String
  },
  introductions: {
    type: Number,
    default: 0
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Affiliate', AffiliateSchema)
