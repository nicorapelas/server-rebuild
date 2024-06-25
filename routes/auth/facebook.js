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
const validateEmailInput = require('../../validation/email')
const keys = require('../../config/keys').keys

const router = express.Router()

// @route  POST auth/facebook/cheack-previous-register
// @desc   Check if user is previously registered using email
// @access Public
router.post('/cheack-previous-register', async (req, res) => {
  const { email } = req.body
  const { errors, isValid } = validateEmailInput(email)
  if (!isValid) {
    res.json({ error: errors })
    return
  }
  const user = await User.findOne({ email })
  if (!user) {
    res.json({ email, userStatus: 'newUser' })
    return
  }
  if (user) {
    const { facebookId } = user
    if (!facebookId) {
      res.json({ email, userStatus: 'facebookFalse' })
      return
    }
    if (facebookId) {
      res.json('facebookTrue')
      return
    }
  }
})

// @route  POST /auth/facebook/register
// @desc   Register a user with facebook
// @access public
router.post('/register', async (req, res) => {
  const { email, fullName, affiliatceIntroCode, facebookIdNumber } = req.body
  // Create user
  const newUser = new User({
    username: email,
    email,
    password: keys.facebook.password,
    affiliatceIntroCode,
    facebookId: true,
    facebookIdNumber: facebookIdNumber,
    emailVerified: true,
    created: Date.now()
  })
  await newUser.save()
  const newPersonalInfo = new PersonalInfo({
    _user: newUser._id,
    fullName
  })
  await newPersonalInfo.save()
  const newContactInfo = new ContactInfo({
    _user: newUser._id,
    email
  })
  await newContactInfo.save()
  res.json('success')
  return
})

// @route  POST auth/facebook/login
// @desc   Login user with Facebook
// @access Public
router.post('/login', async (req, res) => {
  const { facebookIdNumber } = req.body
  try {
    const user = await User.findOne({ facebookIdNumber: facebookIdNumber })
    if (!user) {
      res.json('noFacebookUser')
      return
    }
    const token = jwt.sign({ userId: user._id }, keys.JWT.secret)
    res.json({ token })
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST auth/facebook/link-account
// @desc   Link users account - local & facebook
// @access Public
router.post('/link-account', async (req, res) => {
  const { email, password, facebookIdNumber } = req.body
  console.log(`Route /link-account PASSWORD`, password)
  const user = await User.findOne({ email })
  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, keys.JWT.secret)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        facebookId: true,
        facebookIdNumber: facebookIdNumber
      },
      { new: true }
    )
    res.json({ userStatus: 'userUpdated', facebookIdNumber })
  } catch (err) {
    res.json({ error: 'Invalid password' })
    return
  }
})

module.exports = router
