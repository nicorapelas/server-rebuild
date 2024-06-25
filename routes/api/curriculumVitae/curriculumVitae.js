const express = require('express')
const mongoose = require('mongoose')
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
const { keys } = require('../../../config/keys')
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  POST /api/curriculum-vitae/view
// @desc   Get all current users curriculum-vitae
// @access Private
router.post('/view', async (req, res) => {
  const { id } = req.body
  try {
    const curriculumVitae = await CurriculumVitae.find({ _id: id })
      .populate('_photo')
      .populate('_attribute')
      .populate('_contactInfo')
      .populate('_certificate')
      .populate('_employHistory')
      .populate('_experience')
      .populate('_firstImpression')
      .populate('_interest')
      .populate('_language')
      .populate('_personalInfo')
      .populate('_personalSummary')
      .populate('_reference')
      .populate('_secondEdu')
      .populate('_skill')
      .populate('_tertEdu')
    console.log(`Users 'CurriculumVitae' viewed by recipient`)
    if (!curriculumVitae || curriculumVitae.length < 1) {
      res.json({ error: `"CurriculumVitae" requested not found` })
      return
    }
    res.json({ curriculumVitae })
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/curriculum-vitae
// @desc   Post an amalgamation of cv models
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const userId = { _user: req.user.id }
  try {
    const photo = await Photo.find(userId)
    const certificate = await Certificate.find(userId)
    const attribute = await Attribute.find(userId)
    const contactInfo = await ContactInfo.find(userId)
    const employHistory = await EmployHistory.find(userId)
    const experience = await Experience.find(userId)
    const firstImpression = await FirstImpression.find(userId)
    const interest = await Interest.find(userId)
    const language = await Language.find(userId)
    const personalInfo = await PersonalInfo.find(userId)
    const personalSummary = await PersonalSummary.find(userId)
    const reference = await Reference.find(userId)
    const secondEdu = await SecondEdu.find(userId)
    const skill = await Skill.find(userId)
    const tertEdu = await TertEdu.find(userId)
    const curriculumVitae = new CurriculumVitae({
      _photo: photo,
      _attribute: attribute,
      _contactInfo: contactInfo,
      _certificate: certificate,
      _employHistory: employHistory,
      _experience: experience,
      _firstImpression: firstImpression,
      _interest: interest,
      _language: language,
      _personalInfo: personalInfo,
      _personalSummary: personalSummary,
      _reference: reference,
      _secondEdu: secondEdu,
      _skill: skill,
      _tertEdu: tertEdu,
      _user: req.user.id
    })
    console.log(`Users first 'CurriculumVitae' document created`)
    await curriculumVitae.save()
    res.json(curriculumVitae)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/curriculum-vitae/
// @desc   Get user cv collection
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const curriculumVitae = await CurriculumVitae.find({ _user: req.user.id })
    res.json(curriculumVitae)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/curriculum-vitae/all
// @desc   Post all cv collection
// @access Private
router.post('/all', async (req, res) => {
  if (req.body.pin !== keys.managment.menuPin) {
    res.json({ message: 'who dis' })
    return
  }
  try {
    const curriculumVitae = await CurriculumVitae.find()
    const curriculumVitaeIds = curriculumVitae.map(cv => {
      return cv._id
    })
    res.json(curriculumVitaeIds)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/curriculum-vitae/:id
// @desc   Update user cv
// @access Private
router.patch('/', requireAuth, async (req, res) => {
  const userId = { _user: req.user.id }
  try {
    const photo = await Photo.find(userId)
    const certificate = await Certificate.find(userId)
    const attribute = await Attribute.find(userId)
    const contactInfo = await ContactInfo.find(userId)
    const employHistory = await EmployHistory.find(userId)
    const experience = await Experience.find(userId)
    const firstImpression = await FirstImpression.find(userId)
    const interest = await Interest.find(userId)
    const language = await Language.find(userId)
    const personalInfo = await PersonalInfo.find(userId)
    const personalSummary = await PersonalSummary.find(userId)
    const reference = await Reference.find(userId)
    const secondEdu = await SecondEdu.find(userId)
    const skill = await Skill.find(userId)
    const tertEdu = await TertEdu.find(userId)
    const curriculumVitae = await CurriculumVitae.findByIdAndUpdate(
      req.body.id,
      {
        _photo: photo,
        _attribute: attribute,
        _contactInfo: contactInfo,
        _certificate: certificate,
        _employHistory: employHistory,
        _experience: experience,
        _firstImpression: firstImpression,
        _interest: interest,
        _language: language,
        _personalInfo: personalInfo,
        _personalSummary: personalSummary,
        _reference: reference,
        _secondEdu: secondEdu,
        _skill: skill,
        _tertEdu: tertEdu,
        _user: req.user.id
      },
      { new: true }
    )
    console.log(`Users 'CurriculumVitae' document updated`)
    if (!curriculumVitae) {
      res.json({ error: `"CurriculumVitae" requested not found` })
      return
    }
    res.json(curriculumVitae)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
