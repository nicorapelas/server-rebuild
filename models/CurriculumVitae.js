const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CurriculumVitaeSchema = new mongoose.Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  _attribute: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Attribute'
    }
  ],
  certificate: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  ],
  _contactInfo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'ContactInfo'
    }
  ],
  _employHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'EmployHistory'
    }
  ],
  _experience: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Experience'
    }
  ],
  _interest: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Interest'
    }
  ],
  _language: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Language'
    }
  ],
  _personalInfo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PersonalInfo'
    }
  ],
  _personalSummary: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PersonalSummary'
    }
  ],
  _photo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Photo'
    }
  ],
  _reference: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reference'
    }
  ],
  _secondEdu: [
    {
      type: Schema.Types.ObjectId,
      ref: 'SecondEdu'
    }
  ],
  _skill: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Skill'
    }
  ],
  _tertEdu: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TertEdu'
    }
  ],
  _certificate: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Certificate'
    }
  ],
  _firstImpression: [
    {
      type: Schema.Types.ObjectId,
      ref: 'FirstImpression'
    }
  ]
})

mongoose.model('CurriculumVitae', CurriculumVitaeSchema)
