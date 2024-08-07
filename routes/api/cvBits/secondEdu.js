const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const SecondEdu = mongoose.model('SecondEdu')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/secondary-education/status
// @desc   Get length of current users secondEdu array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const secondEdu = await SecondEdu.find({ _user: req.user.id })
    const secondEduCount = Object.keys(secondEdu).length
    const secondEduLength = new String(secondEduCount)
    res.json(secondEduLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/second-edu/sample
// @desc   Get secondEdu sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const secondEdu = await SecondEdu.find({
      _user: keys.sampleCv.id,
    })
    res.json(secondEdu)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/secondary-education/
// @desc   Get all secondary education
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const secondEdu = await SecondEdu.find({ _user: req.user.id })
    res.json(secondEdu)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/secondary-education/:id
// @desc   Get current user one secondary education
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const secondEdu = await SecondEdu.findById(req.params.id)
    if (!secondEdu) {
      res.json({ error: `'Secondary education' requested not found` })
      return
    }
    res.json(secondEdu)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/secondary-education/
// @desc   Post secondary education
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { schoolName, startDate, endDate } = req.body
  if (!schoolName || schoolName.length < 1) {
    res.json({ error: { schoolName: `'School Name' is required` } })
    return
  }
  if (moment(startDate) > moment(endDate)) {
    res.json({ error: { dates: `'Dates' are invalid` } })
    return
  }
  try {
    // Create secondEdu
    const secondEdu = new SecondEdu({
      _user: req.user.id,
      ...req.body,
    })
    await secondEdu.save()
    let secondEdus = await SecondEdu.find({ _user: req.user.id })
    res.json(secondEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/secondary-education/:id
// @desc   Update secondary education
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { schoolName, startDate, endDate, subjects, additionalInfo } =
    req.body.formValues
  if (!schoolName || schoolName.length < 1) {
    res.json({ error: { schoolName: `'School Name' is required` } })
    return
  }
  if (moment(startDate) > moment(endDate)) {
    res.json({ error: { dates: `'Dates' are invalid` } })
    return
  }
  try {
    // Do update
    const secondEdu = await SecondEdu.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        schoolName,
        startDate,
        endDate,
        subjects,
        additionalInfo,
      },
      { new: true }
    )
    if (!secondEdu) {
      res.json({
        error: `'Secondary education' requested not found`,
      })
      return
    }
    let secondEdus = await SecondEdu.find({ _user: req.user.id })
    res.json(secondEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/secondary-education/:id
// @desc   Delete secondary education
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const secondEdu = await SecondEdu.findByIdAndRemove(req.params.id)
    if (!secondEdu) {
      res.json({ error: `'Secondary education' requested not found` })
      return
    }
    let secondEdus = await SecondEdu.find({ _user: req.user.id })
    res.json(secondEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
