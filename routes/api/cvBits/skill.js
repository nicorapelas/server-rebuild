const express = require('express')
const mongoose = require('mongoose')
const Skill = mongoose.model('Skill')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/skill/status
// @desc   Get length of current users skill array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.find({ _user: req.user.id })
    const skillCount = Object.keys(skill).length
    const skillLength = new String(skillCount)
    res.json(skillLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/skill/sample
// @desc   Get skill sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.find({
      _user: keys.sampleCv.id,
    })
    res.json(skill)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/skill/
// @desc   Get all current users skills
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.find({ _user: req.user.id })
    res.json(skill)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/skill/:id
// @desc   Get one current user skills
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) {
      res.json({ error: `'Skills' requested not found` })
      return
    }
    res.json(skill)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/skill/
// @desc   Post a skill
// @access Private
router.post('/', requireAuth, async (req, res) => {
  // Query unique
  let queryInput = req.body.skill
  let queryDB = await Skill.find({ _user: req.user.id })
  let usersSkills = queryDB.map((query) => {
    return query.skill
  })
  let compare = usersSkills.find((ski) => {
    return ski === queryInput
  })
  if (queryInput.length < 1) {
    res.json({ error: `'Skill' is required` })
    return
  }
  if (compare) {
    res.json({ error: `'Skill' entered already exists` })
    return
  }
  try {
    // Create attribute
    const skill = new Skill({
      _user: req.user.id,
      ...req.body,
    })
    await skill.save()
    let skills = await Skill.find({ _user: req.user.id })
    res.json(skills)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/skill/:id
// @desc   Update a skill
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  // Query unique
  let queryInput = req.body.skill
  let skillSelected = await Skill.findById(req.params.id)
  if (!skillSelected) {
    res.json({ error: `'Skill' requested not found` })
    return
  }
  if (queryInput.length < 1) {
    res.json({ error: `'Skill' is required` })
    return
  }
  try {
    // Do update
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body,
      },
      { new: true }
    )
    res.json(skill)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/skill/:id
// @desc   Delete skill
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndRemove(req.params.id)
    if (!skill) {
      res.json({ error: `'Skill' requested not found` })
      return
    }
    let skills = await Skill.find({ _user: req.user.id })
    res.json(skills)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
