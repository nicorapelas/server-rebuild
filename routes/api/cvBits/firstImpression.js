const express = require('express')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2
const FirstImpression = mongoose.model('FirstImpression')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret,
})

// @route  GET /api/first-impression/status
// @desc   Get length of current users firstImpression array
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const firstImpression = await FirstImpression.find({ _user: req.user.id })
    const firstImpressionCount = Object.keys(firstImpression).length
    const skillLength = new String(firstImpressionCount)
    res.json(skillLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/first-impression/demo
// @desc   Get demo video url
// @access Private
router.get('/demo', requireAuth, async (req, res) => {
  try {
    res.json({ url: keys.cloudinary.demo_video_url })
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/first-impression/delete
// @desc   Delete firstImpresion
// @access Private
router.post('/delete', requireAuth, async (req, res) => {
  const { id, publicId } = req.body
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video',
    })
    if (response.error || response.result === 'not found') {
      res.json({ error: `'Video' requested not found` })
      return
    }
    if (response.result === 'ok') {
      const firstImpressionToDelete = await FirstImpression.findByIdAndDelete({
        _id: id,
      })
      if (!firstImpressionToDelete) {
        res.json({ error: `"First Impression" requested not found` })
        return
      }
      const firstImpression = await FirstImpression.find({ _user: req.user.id })
      res.json(firstImpression[0])
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/first-impression/
// @desc   Get all current users firstImpression
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const firstImpression = await FirstImpression.find({ _user: req.user.id })
    res.json(firstImpression[0])
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/first-impression/:id
// @desc   Get one current user firstImpression
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const firstImpression = await FirstImpression.findById(req.params.id)
    if (!firstImpression) {
      res.json({ error: `'First impression' requested not found` })
      return
    }
    res.json(firstImpression)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/first-impression/
// @desc   Post a firstImpression
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { videoUrl, publicId } = req.body
  try {
    const checkFirstImpression = await FirstImpression.find({
      _user: req.user.id,
    })
    if (checkFirstImpression.length > 0) {
      res.json({ error: `'FirstImpression' length > 0 ` })
      return
    }
    const firstImpression = new FirstImpression({
      _user: req.user.id,
      videoUrl,
      publicId,
    })
    await firstImpression.save()
    res.json(firstImpression)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
