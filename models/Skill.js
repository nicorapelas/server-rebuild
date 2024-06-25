const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SkillSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  skill: {
    type: String,
    required: true,
  },
  proficiency: {
    type: Number,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
})

mongoose.model('Skill', SkillSchema)
