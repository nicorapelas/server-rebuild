const express = require('express')
const mongoose = require('mongoose')
const PersonalInfo = mongoose.model('PersonalInfo')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/personal-info/status
// @desc   Get status of current users attribute collection
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.find({ _user: req.user.id })
    if (!personalInfo || personalInfo.length < 1) {
      const zeroData = new String(0)
      res.json(zeroData)
      return
    }
    const [
      {
        fullName,
        dateOfBirth,
        idNumber,
        gender,
        ppNumber,
        saCitizen,
        nationality,
        driversLicense
      }
    ] = personalInfo
    let [num1, num2, num3, num4, num5] = [0]
    !fullName ? (num1 = 0) : (num1 = 17)
    !gender ? (num2 = 0) : (num2 = 17)
    !driversLicense ? (num3 = 0) : (num3 = 17)
    ppNumber || saCitizen || nationality || idNumber ? (num4 = 32) : (num4 = 0)
    !dateOfBirth ? (num5 = 0) : (num5 = 17)
    const response = new String(num1 + num2 + num3 + num4 + num5)
    res.json(response)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/personalInfo/sample
// @desc   Get personalInfo sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.find({ _user: keys.sampleCv.id })
    res.json(personalInfo)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/personal-info/view-heading-sample
// @desc   Fetch sample heading
// @access private
router.get('/view-heading-sample', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.find({ _user: keys.sampleCv.id })
    if (
      !personalInfo ||
      personalInfo.length < 1 ||
      (personalInfo[0].fullName.length < 1 &&
        personalInfo[0].dateOfBirth.length < 1)
    ) {
      res.json('noData')
      return
    }
    const viewHeading = {
      fullName: personalInfo[0].fullName,
      dateOfBirth: personalInfo[0].dateOfBirth
    }
    res.json(viewHeading)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/personal-info/view-heading
// @desc   Fetch current users name and birth date of birth
// @access private
router.get('/view-heading', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.find({ _user: req.user.id })
    if (
      !personalInfo ||
      personalInfo.length < 1 ||
      (personalInfo[0].fullName.length < 1 &&
        personalInfo[0].dateOfBirth.length < 1)
    ) {
      res.json('noData')
      return
    }
    const viewHeading = {
      fullName: personalInfo[0].fullName,
      dateOfBirth: personalInfo[0].dateOfBirth
    }
    res.json(viewHeading)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/personal-info
// @desc   Fetch current users personalInfo
// @access private
router.get('/', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.find({ _user: req.user.id })
    res.json(personalInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/personal-info/:id
// @desc   Get one personal info
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.findById(req.params.id)
    if (!personalInfo) {
      res.json({ error: `'Personal info' requested not found` })
      return
    }
    res.json(personalInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/personal-info/
// @desc   Post personal info
// @access Private
router.post('/', requireAuth, async (req, res) => {
  try {
    // Query DB
    let firstCheck = await PersonalInfo.find({ _user: req.user.id })
    if (firstCheck.length > 0) {
      res.json({ error: `PersonalInfo length > 0` })
      return
    }
    const { fullName } = req.body
    if (fullName.length < 1) {
      res.json({ error: `'Full Name' is required` })
      return
    }
    // Create personal info
    const personalInfo = new PersonalInfo({
      _user: req.user.id,
      ...req.body
    })
    await personalInfo.save()
    res.json(personalInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/personal-info/:id
// @desc   Update personal info
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  const { fullName } = req.body
  if (fullName.length < 1) {
    res.json({ error: `'Full Name' is required` })
    return
  }
  try {
    const personalInfo = await PersonalInfo.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body
      },
      { new: true }
    )
    if (!personalInfo)
      res.status(404).json({ error: `'Personal Info' requested not found` })
    // Return updated genre
    res.json(personalInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/personal-info/:id
// @desc   Delete personal info
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const personalInfo = await PersonalInfo.findByIdAndRemove(req.params.id)
    if (!personalInfo) {
      res.json({ error: `'Personal Info' requested not found` })
      return
    }
    res.json(personalInfo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
