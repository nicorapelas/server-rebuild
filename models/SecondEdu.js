const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SecondEduSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  schoolName: {
    type: String,
    required: true
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  subjects: [
    {
      subject: String,
      key: String
    }
  ],

  additionalInfo: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('SecondEdu', SecondEduSchema)
