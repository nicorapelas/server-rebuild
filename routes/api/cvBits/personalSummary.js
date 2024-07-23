const express = require('express')
const mongoose = require('mongoose')
const PersonalSummary = mongoose.model('PersonalSummary')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/personal-summary/length
// @desc   Get current users personal-summary length
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const personalSummary = await PersonalSummary.find({
      _user: req.user.id,
    })
    if (!personalSummary || personalSummary.length < 1) {
      res.json('0')
      return
    }
    const personalSummaryContent = new String(personalSummary[0].content)
    const personalSummaryCount = personalSummaryContent.length
    const personalSummaryLength = new String(personalSummaryCount)
    res.json(personalSummaryLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/personalSummary/sample
// @desc   Get personalSummary sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const personalSummary = await PersonalSummary.find({
      _user: keys.sampleCv.id,
    })
    res.json(personalSummary)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/personal-summary/
// @desc   Get all current users personal-summary
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const personalSummary = await PersonalSummary.find({ _user: req.user.id })
    res.json(personalSummary)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/personal-summary/
// @desc   Post personal summary
// @access Private
router.post('/', requireAuth, async (req, res) => {
  console.log(`body:`, req.body)
  try {
    // Query DB
    let firstCheck = await PersonalSummary.find({ _user: req.user.id })
    if (firstCheck.length > 0) {
      res.json({ error: `'PersonalSummary' length > 0` })
      return
    }
    const { content } = req.body
    if (!content || content.length < 1) {
      res.json({ error: `'Content' is required` })
      return
    }
    // Create personal summary
    const personalSummary = new PersonalSummary({
      _user: req.user.id,
      ...req.body,
    })
    await personalSummary.save()
    res.json([personalSummary])
    return
  } catch (error) {
    console.log(error)
  }
})

// @route  GET /api/personal-summary/:id
// @desc   Get one personal-summary
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const personalSummary = await PersonalSummary.findById(req.params.id)
    if (!personalSummary) {
      res.json({ error: `'PersonalSummary' requested not found` })
      return
    }
    res.json(personalSummary)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  Patch /api/personal-summary/:id
// @desc   Update PersonalSumarry
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  console.log(req.body)
  const { content } = req.body
  if (content.length < 1) {
    res.json({ error: `'Content' is required` })
    return
  }
  try {
    // Do update
    const personalSummary = await PersonalSummary.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        content,
      },
      { new: true }
    )
    res.json([personalSummary])
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/personal-summary/:id
// @desc   Delete personalSummary
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const personalSummary = await PersonalSummary.findByIdAndRemove(
      req.params.id
    )
    if (!personalSummary) {
      res.json({ error: `'Personal Summary' requested not found` })
      return
    }
    // Return deleted about me content
    res.json(personalSummary)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
