const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ExperienceSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
})

mongoose.model('Experience', ExperienceSchema)
