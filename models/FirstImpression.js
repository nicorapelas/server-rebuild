const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FirstImpressionSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  videoUrl: {
    type: String
  },
  publicId: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('FirstImpression', FirstImpressionSchema)
