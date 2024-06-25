const express = require('express')
const mongoose = require('mongoose')
const Reference = mongoose.model('Reference')
const keys = require('../../../config/keys').keys
const validateEmailInput = require('../../../validation/email')
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/reference/status
// @desc   Get length of all current users references array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const reference = await Reference.find({ _user: req.user.id })
    const referenceCount = Object.keys(reference).length
    const referenceLength = new String(referenceCount)
    res.json(referenceLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/reference/sample
// @desc   Get reference sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const reference = await Reference.find({
      _user: keys.sampleCv.id
    })
    res.json(reference)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/reference/
// @desc   Get all current users references
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const reference = await Reference.find({ _user: req.user.id })
    res.json(reference)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/reference/:id
// @desc   Get one current user reference
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const reference = await Reference.findById(req.params.id)
    if (!reference) {
      res.json({ error: `'Reference' requested not found` })
      return
    }
    res.json(reference)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/reference/
// @desc   Post a reference
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { name, phone } = req.body
  if (name.length < 1) {
    res.json({ error: { name: `'Name' is required` } })
    return
  }
  if (phone.length === 0) {
    res.json({ error: { phone: `'Phone number' is required` } })
    return
  }
  if (phone.length < 10 || phone.length > 14) {
    res.json({ error: { phone: `''Phone number' is invalid` } })
    return
  }
  try {
    // Create reference
    const reference = new Reference({
      _user: req.user.id,
      ...req.body
    })
    await reference.save()
    res.json(reference)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/reference/:id
// @desc   Update a reference
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { name, phone } = req.body
  if (name.length < 1) {
    res.json({ error: { name: `'Name' is required` } })
    return
  }
  if (phone.length === 0) {
    res.json({ error: { phone: `'Phone number' is required` } })
    return
  }
  if (phone.length < 10 || phone.length > 14) {
    res.json({ error: { phone: `''Phone number' is invalid` } })
    return
  }
  try {
    // Do update
    const reference = await Reference.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body
      },
      { new: true }
    )
    if (!reference) {
      res.json({ error: `'Reference' requested not found` })
      return
    }
    res.json(reference)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/reference/:id
// @desc   Delete reference
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const reference = await Reference.findByIdAndRemove(req.params.id)
    if (!reference) {
      res.json({ error: `'Reference' requested not found` })
      return
    }
    // Return deleted reference
    res.json(reference)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
