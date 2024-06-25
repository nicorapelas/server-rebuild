const express = require('express')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Attribute = mongoose.model('Attribute')
const Certificate = mongoose.model('Certificate')
const ContactInfo = mongoose.model('ContactInfo')
const EmployHistory = mongoose.model('EmployHistory')
const Experience = mongoose.model('Experience')
const Interest = mongoose.model('Interest')
const Language = mongoose.model('Language')
const PersonalInfo = mongoose.model('PersonalInfo')
const PersonalSummary = mongoose.model('PersonalSummary')
const Photo = mongoose.model('Photo')
const Reference = mongoose.model('Reference')
const SecondEdu = mongoose.model('SecondEdu')
const Skill = mongoose.model('Skill')
const TertEdu = mongoose.model('TertEdu')
const CurriculumVitae = mongoose.model('CurriculumVitae')
const FirstImpression = mongoose.model('FirstImpression')
const requireAuth = require('../../middlewares/requireAuth')
const { keys } = require('../../config/keys')

const router = express.Router()

router.get('/', async (req, res) => {
  res.json({ msg: 'server running...' })
})

router.get('/users-info', requireAuth, async (req, res) => {
  if (req.user.id !== keys.managment.id) {
    res.json({ error: 'Access denide' })
    return
  }
  const usersInfo = await User.find()
  res.json(usersInfo)
  return
})

router.post('/clean-up', async (req, res) => {
  const items = await User.find()
  console.log(items.length)
  items.map(item => {
    if (
      item._id.equals('6165e5664528ef00162504df') ||
      item._id.equals('619931ebf51ac200166a95c0') ||
      item._id.equals('617268b6ddf5e100168f556d')
    ) {
      console.log('save item')
    } else {
      item.deleteOne()
      console.log(`item deleted`)
    }
  })
  res.json({ msg: 'done' })
})

module.exports = router

// nico
// { "id": "6129ca2c14ccbb2467752efc" }

// nikki
// { "id": "6165e5664528ef00162504df" }

// felicia
// { "id": "619931ebf51ac200166a95c0" }

// megan
// { "id": "617268b6ddf5e100168f556d" }
