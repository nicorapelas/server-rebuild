const express = require('express')
const mongoose = require('mongoose')
const Interest = mongoose.model('Interest')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/interest/status
// @desc   Get length of current users interest array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const interest = await Interest.find({ _user: req.user.id })
    const interestCount = Object.keys(interest).length
    const interestLength = new String(interestCount)
    res.json(interestLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/interest/sample
// @desc   Get interest sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const interest = await Interest.find({ _user: keys.sampleCv.id })
    res.json(interest)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/interest/
// @desc   Get all current users interest
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const interest = await Interest.find({ _user: req.user.id })
    res.json(interest)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/interest/:id
// @desc   Get one current user interest
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const interest = await Interest.findById(req.params.id)
    if (!interest) {
      res.json({ error: `'Interest' requested not found` })
      return
    }
    res.json(interest)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/interest/
// @desc   Post a interest
// @access Private
router.post('/', requireAuth, async (req, res) => {
  let interestArray = req.body
  if (interestArray.length < 1) {
    res.json({ error: `'Interest' is required` })
    return
  }
  try {
    await Interest.deleteMany({ _user: req.user.id })
    await Promise.all(
      interestArray.map(async (interest) => {
        const int = new Interest({
          _user: req.user.id,
          interest: interest.interest,
        })
        await int.save()
      })
    )
    const interests = await Interest.find({ _user: req.user._id })
    res.json(interests)
  } catch (error) {
    console.log(error)
  }
})

// @route  PATCH /api/interest/:id
// @desc   Update a interest
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { interest } = req.body
  if (!interest || interest.length < 1) {
    return res.status(400).json({ error: 'Interest is required' })
  }
  try {
    // Query unique
    const interestSelected = await Interest.findById(req.params.id)
    if (!interestSelected) {
      return res.status(404).json({ error: 'Interest requested not found' })
    }
    const userInterests = await Interest.find({ _user: req.user.id })
    const usersInterests = userInterests.map((int) => int.interest)
    const duplicateInterest = usersInterests.find((int) => int === interest)
    if (interest === interestSelected.interest) {
      return res.status(400).json({ error: 'Interest unique query failed' })
    }
    if (duplicateInterest) {
      await Interest.findByIdAndRemove(req.params.id)
      return res.status(400).json({ error: 'Interest unique query failed' })
    }
    // Update interest
    await Interest.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        interest,
        ...req.body,
      },
      { new: true }
    )
    // Fetch updated user's interest collection
    const updatedUserInterests = await Interest.find({ _user: req.user.id })
    return res.json(updatedUserInterests)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

// @route  DELETE /api/interest/:id
// @desc   Delete interest
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const interest = await Interest.findByIdAndRemove(req.params.id)
    if (!interest) {
      res.json({ error: `'Interest' requested not found` })
      return
    }
    const updatedInterests = await Interest.find({ _user: req.user.id })
    res.json(updatedInterests)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router
