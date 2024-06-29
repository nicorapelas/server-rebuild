const express = require('express')
const mongoose = require('mongoose')
const Attribute = mongoose.model('Attribute')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/attribute/status
// @desc   Get all current users attributes length
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const attribute = await Attribute.find({ _user: req.user.id })
    const attributeCount = Object.keys(attribute).length
    const attributeLength = new String(attributeCount)
    res.json(attributeLength)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/attribute/sample
// @desc   Get attribute sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const attribute = await Attribute.find({ _user: keys.sampleCv.id })
    res.json(attribute)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/attribute/
// @desc   Get all current users attributes
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const attribute = await Attribute.find({ _user: req.user.id })
    res.json(attribute)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/attribute/:id
// @desc   Get one current user attribute
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id)
    if (!attribute) {
      res.json({ error: `'Attribute' requested not found` })
      return
    }
    res.json(attribute)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  POST /api/attribute/
// @desc   Post a attribute
// @access Private
router.post('/', requireAuth, async (req, res) => {
  let attributeArray = req.body
  if (attributeArray.length < 1) {
    res.json({ error: `'Attribute' is required` })
    return
  }
  try {
    await Attribute.deleteMany({ _user: req.user.id })
    await Promise.all(
      attributeArray.map(async (attribute) => {
        const att = new Attribute({
          _user: req.user.id,
          attribute: attribute.attribute,
        })
        await att.save()
      })
    )
    const attributes = await Attribute.find({ _user: req.user._id })
    res.json(attributes)
  } catch (error) {
    console.log(error)
  }
})

// @route  PATCH /api/attribute/:id
// @desc   Update an attribute
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { attribute } = req.body
  if (!attribute || attribute.length < 1) {
    return res.status(400).json({ error: 'Attribute is required' })
  }
  try {
    // Query unique
    const attributeSelected = await Attribute.findById(req.params.id)
    if (!attributeSelected) {
      return res.status(404).json({ error: 'Attribute requested not found' })
    }
    const userAttributes = await Attribute.find({ _user: req.user.id })
    const usersAttributes = userAttributes.map((attr) => attr.attribute)
    const duplicateAttribute = usersAttributes.find((att) => att === attribute)
    if (attribute === attributeSelected.attribute) {
      return res.status(400).json({ error: 'Attribute unique query failed' })
    }
    if (duplicateAttribute) {
      await Attribute.findByIdAndRemove(req.params.id)
      return res.status(400).json({ error: 'Attribute unique query failed' })
    }
    // Update attribute
    const updatedAttribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        attribute,
        ...req.body,
      },
      { new: true }
    )
    // Fetch updated user's attribute collection
    const updatedUserAttributes = await Attribute.find({ _user: req.user.id })
    return res.json({
      updatedAttribute,
      userAttributes: updatedUserAttributes,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// @route  DELETE /api/attribute/:id
// @desc   Delete attribute
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndRemove(req.params.id)
    if (!attribute) {
      res.json({ error: `'Attribute' requested not found` })
      return
    }
    const updatedAttributes = await Attribute.find({ _user: req.user.id })
    res.json(updatedAttributes)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
