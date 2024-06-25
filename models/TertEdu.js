const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TertEduSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  instituteName: {
    type: String,
    required: true
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  certificationType: {
    type: String
  },
  description: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('TertEdu', TertEduSchema)
