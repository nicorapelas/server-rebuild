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
  // Query unique
  let queryInput = req.body.interest
  try {
    let interestSelected = await Interest.findById(req.params.id)
    let queryDB = await Interest.find({ _user: req.user.id })
    let usersInterests = queryDB.map((query) => {
      return query.interest
    })
    let compare = usersInterests.find((int) => {
      return int === queryInput
    })
    if (!interestSelected) {
      res.json({ error: `'Interest' requested not found` })
      return
    }
    if (queryInput === interestSelected.interest) {
      res.json({ error: `'Interest' entered already exists` })
      return
    }
    if (compare) {
      await Interest.findByIdAndRemove(req.params.id)
      res.json({ error: `'Interest' unique query failed` })
      return
    }
    if (queryInput.length < 1) {
      res.json({ error: `'Interest' is required` })
      return
    }
    // Do update
    const interest = await Interest.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body,
      },
      { new: true }
    )
    res.json(interest)
    return
  } catch (error) {
    console.log(error)
    return
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
    // Return deleted interest
    res.json(interest)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
