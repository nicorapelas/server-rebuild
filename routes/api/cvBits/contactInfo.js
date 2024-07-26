const express = require('express')
const mongoose = require('mongoose')
const ContactInfo = mongoose.model('ContactInfo')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')
const validateEmailInput = require('../../../validation/email')

const router = express.Router()

// @route  GET /api/contact-info/status
// @desc   Get number of completed fields in collection
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find({ _user: req.user.id })
    if (!contactInfo || contactInfo.length < 1) {
      res.send('0')
      return
    }
    const [{ phone, email, address, city, province, country, postalCode }] =
      contactInfo
    let [num1, num2, num3] = [0]
    phone ? (num1 = 34) : (num1 = 0)
    email ? (num2 = 33) : (num2 = 0)
    address || city || province || country || postalCode
      ? (num3 = 33)
      : (num3 = 0)
    const response = new String(num1 + num2 + num3)
    res.send(response)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/contact-info/sample
// @desc   Get contact info sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find({ _user: keys.sampleCv.id })
    res.json(contactInfo)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/contact-info
// @desc   Get all current user contact info
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find({ _user: req.user.id })
    res.json(contactInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/contact-info/
// @desc   Post contact info
// @access Private
router.post('/', requireAuth, async (req, res) => {
  try {
    // Query DB
    let firstCheck = await ContactInfo.find({ _user: req.user.id })
    if (firstCheck.length > 0) {
      res.json({ error: `'ContactInfo' length > 0` })
      return
    }
    const { email, phone } = req.body
    const { errors, isValid } = validateEmailInput(email)
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
    // Create contact info
    const contactInfo = new ContactInfo({
      _user: req.user.id,
      ...req.body,
    })
    await contactInfo.save()
    res.json([contactInfo])
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/contact-info/:id
// @desc   Update contact info
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { email, phone } = req.body
  // Validate user input
  const { errors, isValid } = validateEmailInput(email)
  if (!isValid) {
    res.json({ error: errors.email })
    return
  }
  if (phone.length === 0) {
    res.json({ error: `'Phone number' is required` })
    return
  }
  if (phone.length < 10 || phone.length > 14) {
    res.json({ error: `''Phone number' is invalid` })
    return
  }
  try {
    const contactInfo = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body,
      },
      { new: true }
    )
    if (!contactInfo) {
      res.json({ error: `'Contact info' requested not found` })
      return
    }
    res.json(contactInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/contact-info/:id
// @desc   Delete contact info
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findByIdAndRemove(req.params.id)
    if (!contactInfo) {
      res.json({ error: `'Contact Info' requested not found` })
      return
    }
    res.json(contactInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
