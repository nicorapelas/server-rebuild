const express = require('express')
const mongoose = require('mongoose')
const ContactInfo = mongoose.model('ContactInfo')
const PersonalInfo = mongoose.model('PersonalInfo')
const requireAuth = require('../../../middlewares/requireAuth')
const validateEmailInput = require('../../../validation/email')

const router = express.Router()

// @route  POST /api/start-up/
// @desc   Post some contact info and personal info
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { fullName, email, phone } = req.body
  const { errors, isValid } = validateEmailInput(email)
  if (!fullName || fullName.length === 0) {
    res.json({ error: { fullName: `'Full name' is required` } })
    return
  }
  if (!isValid) {
    res.json({ error: { email: errors.email } })
    return
  }
  if (!phone || phone.length === 0) {
    res.json({ error: { phone: `'Phone number' is required` } })
    return
  }
  if (phone.length < 10 || phone.length > 14) {
    res.json({ error: { phone: `''Phone number' is invalid` } })
    return
  }
  try {
    // Query DB
    let firstCheckContactInfo = await ContactInfo.find({ _user: req.user.id })
    if (firstCheckContactInfo.length > 0) {
      res.json({ error: `'ContactInfo' length > 0` })
      return
    }
    // Create
    const personalInfo = new PersonalInfo({
      _user: req.user.id,
      fullName
    })
    const contactInfo = new ContactInfo({
      _user: req.user.id,
      email,
      phone
    })
    await personalInfo.save()
    await contactInfo.save()
    res.json(contactInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
