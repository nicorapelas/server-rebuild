const express = require('express')
const mongoose = require('mongoose')
// const moment = require('moment')
const EmployHistory = mongoose.model('EmployHistory')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/employmeny-history/status
// @desc   Get all current user contact info
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const employHistory = await EmployHistory.find({ _user: req.user.id })
    const employHistoryCount = Object.keys(employHistory).length
    const employHistoryLength = new String(employHistoryCount)
    res.json(employHistoryLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/employ-history/sample
// @desc   Get employment history sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const employHistory = await EmployHistory.find({ _user: keys.sampleCv.id })
    res.json(employHistory)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/employment-history
// @desc   Get all current user contact info
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const employHistory = await EmployHistory.find({ _user: req.user.id })
    res.json(employHistory)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/employment-history/:id
// @desc   Get one employment history
// @access Private
router.get('/:id', async (req, res) => {
  try {
    const employHistory = await EmployHistory.findById(req.params.id)
    if (!employHistory) {
      res.json({ error: `'Employment history' requested not found` })
      return
    }
    res.json(employHistory)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/employment-history/
// @desc   Post employment history
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { company } = req.body
  if (company.length < 1) {
    res.json({ error: { company: `'Company Name' is required` } })
    return
  }
  try {
    // Create employment history
    const employHistory = new EmployHistory({
      _user: req.user.id,
      ...req.body,
    })
    await employHistory.save()
    const employHistorys = await EmployHistory.find({ _user: req.user.id })
    res.json(employHistorys)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/employment-history/:id
// @desc   Update employment history
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { company } = req.body.formValues
  if (company.length < 1) {
    res.json({ error: { company: `'Company' is required` } })
    return
  }
  try {
    // Do update
    const employHistory = await EmployHistory.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body.formValues,
      },
      { new: true }
    )
    if (!employHistory) {
      res.json({ error: `'Employment history' requested not found` })
      return
    }
    const employHistorys = await EmployHistory.find({ _user: req.user.id })
    res.json(employHistorys)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/employmeny-history/:id
// @desc   Delete emploment history
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const employHistory = await EmployHistory.findByIdAndRemove(req.params.id)
    if (!employHistory) {
      res.json({ error: `'Employment history' requested not found` })
      return
    }
    const employHistorys = await EmployHistory.find({ _user: req.user.id })
    res.json(employHistorys)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
