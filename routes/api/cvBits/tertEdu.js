const express = require('express')
const mongoose = require('mongoose')
const moment = require('moment')
const TertEdu = mongoose.model('TertEdu')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/tertiary-education/status
// @desc   Get length of current users tertEdu array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const tertEdu = await TertEdu.find({ _user: req.user.id })
    const tertEduCount = Object.keys(tertEdu).length
    const tertEduLength = new String(tertEduCount)
    res.json(tertEduLength)
    return
  } catch (error) {
    console.log(error)
  }
})

// @route  GET /api/tertiary-education/sample
// @desc   Get tertiary-education sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const tertEdu = await TertEdu.find({
      _user: keys.sampleCv.id,
    })
    res.json(tertEdu)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/tertiary-education
// @desc   Get all current user tertiary education
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const tertEdu = await TertEdu.find({ _user: req.user.id })
    res.json(tertEdu)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/tertiary-education/:id
// @desc   Get one tertiary education
// @access Public
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const tertEdu = await TertEdu.findById(req.params.id)
    if (!tertEdu) {
      res.json({ error: `'Tertiary education' requested not found` })
      return
    }
    res.json(tertEdu)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/tertiary-education/
// @desc   Post tertiary education
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { instituteName, startDate, endDate } = req.body
  if (!instituteName || instituteName.length < 1) {
    res.json({ error: { instituteName: `'Institute name' is required` } })
    return
  }
  if (moment(startDate) > moment(endDate)) {
    res.json({ error: { dates: `'Dates' are invalid` } })
    return
  }
  try {
    // Create tertEdu
    const tertEdu = new TertEdu({
      _user: req.user.id,
      ...req.body,
    })
    await tertEdu.save()
    let tertEdus = await TertEdu.find({ _user: req.user.id })
    res.json(tertEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/tertiary-education/:id
// @desc   Update tertiary education
// @access Private

router.patch('/:id', requireAuth, async (req, res) => {
  console.log(req.body)
  const {
    instituteName,
    startDate,
    endDate,
    certificationType,
    description,
    additionalInfo,
  } = req.body.formValues
  if (!instituteName || instituteName.length < 1) {
    res.json({ error: { instituteName: `'Institute Name' is required` } })
    return
  }
  if (moment(startDate) > moment(endDate)) {
    res.json({ error: { dates: `'Dates' are invalid` } })
    return
  }
  try {
    // Do update
    const tertEdu = await TertEdu.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        instituteName,
        startDate,
        endDate,
        certificationType,
        description,
        additionalInfo,
      },
      { new: true }
    )
    if (!tertEdu) {
      res.json({
        error: `'Tertiary education' requested not found`,
      })
      return
    }
    let tertEdus = await TertEdu.find({ _user: req.user.id })
    console.log(`tertEdus:`, tertEdus)
    res.json(tertEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// router.patch('/:id', requireAuth, async (req, res) => {
//   console.log(req.params.id)
//   const { instituteName, startDate, endDate } = req.body.formValues
//   if (!instituteName || instituteName.length < 1) {
//     res.json({ error: { instituteName: `'Institute Name' is required` } })
//     return
//   }
//   if (moment(startDate) > moment(endDate)) {
//     res.json({ error: { dates: `'Dates' are invalid` } })
//     return
//   }
//   try {
//     // Do update
//     const tertEdu = await TertEdu.findByIdAndUpdate(
//       req.params.id,
//       {
//         _user: req.user.id,
//         lastUpdate: new Date(),
//         ...req.body,
//       },
//       { new: true }
//     )
//     if (!tertEdu) {
//       res.json({
//         error: { notFound: `'Tertiary Education' requested not found` },
//       })
//       return
//     }
//     console.log(`tertEdu:`, tertEdu)
//     const tertEdus = await TertEdu.find({ _user: req.user.id })
//     res.json(tertEdus)
//     return
//   } catch (error) {
//     console.log(error)
//     return
//   }
// })

// @route  DELETE /api/tertiary-education/:id
// @desc   Delete tertiary education
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const tertEdu = await TertEdu.findByIdAndRemove(req.params.id)
    if (!tertEdu) {
      res.json({ error: `'Tertiary education' requested not found` })
      return
    }
    let tertEdus = await TertEdu.find({ _user: req.user.id })
    res.json(tertEdus)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
