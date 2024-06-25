const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
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
const keys = require('../../config/keys').keys

const router = express.Router()

// @route  GET auth/google/credentials
// @desc   Get google Oauth credentials
// @access Public
router.get('/credentials', (req, res) => {
  const credentials = {
    androidClientId: keys.google.androidClientId,
    iosClientId: keys.google.iosClientId
  }
  res.send(credentials)
})

// @route  POST auth/google/
// @desc   Register user with google Oauth
// @access Public
router.post('/', async (req, res) => {
  console.log(req.body)
  res.json(req.body)
})

// @route  POST auth/google/
// @desc   Register user with google Oauth
// @access Public
// router.post('/', async (req, res) => {
//   const { oauthId, email, name, avatar, affiliatceIntroCode } = req.body
//   const existingUser = await User.findOne({ email })
//   if (existingUser) {
//     if (existingUser.localId) {
//       res.json({
//         error: `You've previously registered using Email, please login using Email`
//       })
//       return
//     }
//     if (existingUser.facebookId) {
//       res.json({
//         error: `You've previously registered using Facebook, please login using Facebook`
//       })
//       return
//     }
//     if (existingUser.googleId) {
//       const token = jwt.sign({ userId: existingUser._id }, keys.JWT.secret)
//       res.json({ token })
//       return
//     }
//   } else {
//     const newUser = new User({
//       oauthId,
//       username: email,
//       email,
//       name,
//       avatar,
//       affiliatceIntroCode,
//       googleId: true
//     })
//     await newUser.save()
//     const newPersonalInfo = new PersonalInfo({
//       _user: newUser._id,
//       fullName: name
//     })
//     await newPersonalInfo.save()
//     const newContactInfo = new ContactInfo({
//       _user: newUser._id,
//       email
//     })
//     await newContactInfo.save()
//     await newContactInfo.save()
//     const photo = await Photo.find(newUser._id)
//     const certificate = await Certificate.find(newUser._id)
//     const attribute = await Attribute.find(newUser._id)
//     const contactInfo = await ContactInfo.find(newUser._id)
//     const employHistory = await EmployHistory.find(newUser._id)
//     const experience = await Experience.find(newUser._id)
//     const firstImpression = await FirstImpression.find(newUser._id)
//     const interest = await Interest.find(newUser._id)
//     const language = await Language.find(newUser._id)
//     const personalInfo = await PersonalInfo.find(newUser._id)
//     const personalSummary = await PersonalSummary.find(newUser._id)
//     const reference = await Reference.find(newUser._id)
//     const secondEdu = await SecondEdu.find(newUser._id)
//     const skill = await Skill.find(newUser._id)
//     const tertEdu = await TertEdu.find(newUser._id)
//     const curriculumVitae = new CurriculumVitae({
//       _photo: photo,
//       _attribute: attribute,
//       _contactInfo: contactInfo,
//       _certificate: certificate,
//       _employHistory: employHistory,
//       _experience: experience,
//       _firstImpression: firstImpression,
//       _interest: interest,
//       _language: language,
//       _personalInfo: personalInfo,
//       _personalSummary: personalSummary,
//       _reference: reference,
//       _secondEdu: secondEdu,
//       _skill: skill,
//       _tertEdu: tertEdu,
//       _user: newUser._id
//     })
//     console.log(`Users first 'CurriculumVitae' document created`)
//     await curriculumVitae.save()
//     const token = jwt.sign({ userId: newUser._id }, keys.JWT.secret)
//     res.json({ token })
//     return
//   }
// })

module.exports = router
