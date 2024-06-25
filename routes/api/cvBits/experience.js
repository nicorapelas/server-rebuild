const express = require('express')
const mongoose = require('mongoose')
const Experience = mongoose.model('Experience')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/experience/status
// @desc   Get length of current users experience array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.find({ _user: req.user.id })
    const experienceCount = Object.keys(experience).length
    const experienceLength = new String(experienceCount)
    res.json(experienceLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/experience/sample
// @desc   Get experience sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.find({ _user: keys.sampleCv.id })
    res.json(experience)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/experience/
// @desc   Get all current users experiences
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.find({ _user: req.user.id })
    res.json(experience)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/experience/:id
// @desc   Get one current user experiences
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
    if (!experience) {
      res.json({ error: `'Experiences' requested not found` })
      return
    }
    res.json(experience)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/experience/
// @desc   Post a experience
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { title } = req.body
  if (title.length < 1) {
    res.json({ error: { title: `'Title' is required` } })
    return
  }
  try {
    // Create language
    const experience = new Experience({
      _user: req.user.id,
      ...req.body
    })
    await experience.save()
    res.json(experience)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/experience/:id
// @desc   Update a experience
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { title } = req.body
  if (title.length < 1) {
    res.json({ error: { title: `'Title' is required` } })
    return
  }
  try {
    // Do update
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body
      },
      { new: true }
    )
    if (!experience) {
      res.json({ error: `'Experience' requested not found` })
      return
    }
    res.json(experience)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/experience/:id
// @desc   Delete experience
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndRemove(req.params.id)
    if (!experience) {
      res.json({ error: `'Experience' requested not found` })
      return
    }
    // Return deleted experience
    res.json(experience)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
