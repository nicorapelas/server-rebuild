const express = require('express')
const mongoose = require('mongoose')
const Language = mongoose.model('Language')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /api/language/status
// @desc   Get length of current users language array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const language = await Language.find({ _user: req.user.id })
    const languageCount = Object.keys(language).length
    const languageLength = new String(languageCount)
    res.json(languageLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/language/sample
// @desc   Get language sample
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const language = await Language.find({ _user: keys.sampleCv.id })
    res.json(language)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/language
// @desc   Get all current users languages
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const language = await Language.find({ _user: req.user.id })
    res.json(language)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/language/:id
// @desc   Get one current user language
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const language = await Language.findById(req.params.id)
    if (!language) {
      res.json({ error: `'Language' requested not found` })
      return
    }
    res.json(language)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/linguistic/
// @desc   Post a language
// @access Private
router.post('/', requireAuth, async (req, res) => {
  // Query unique
  let queryInput = req.body.language
  try {
    let queryDB = await Language.find({ _user: req.user.id })
    let usersLanguages = queryDB.map(query => {
      return query.language
    })
    let compare = usersLanguages.find(lang => {
      return lang === queryInput
    })
    if (queryInput.length < 1) {
      res.json({ error: `'Language' is required` })
      return
    }
    if (compare) {
      res.json({ error: `'Language' entered already exists` })
      return
    }
    // Create attribute
    const language = new Language({
      _user: req.user.id,
      ...req.body
    })
    await language.save()
    res.json(language)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/language/:id
// @desc   Update a language
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  // Query unique
  let queryInput = req.body.language
  try {
    let languageSelected = await Language.findById(req.params.id)
    if (!languageSelected) {
      res.json({ error: `'Language' requested not found` })
      return
    }
    if (queryInput.length < 1) {
      res.json({ error: `'Language' is required` })
      return
    }
    // Do update
    const language = await Language.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body
      },
      { new: true }
    )
    res.json(language)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  DELETE /api/language/:id
// @desc   Delete language
// @access Private
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const language = await Language.findByIdAndRemove(req.params.id)
    if (!language) {
      res.json({ error: `'Languages' requested not found` })
      return
    }
    // Return deleted language
    res.json(language)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
