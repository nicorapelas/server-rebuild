const express = require('express')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
const Certificate = mongoose.model('Certificate')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret
})

// @route  GET /api/certificate/status
// @desc   Get current users certificate collection length
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const certificate = await Certificate.find({ _user: req.user.id })
    const certificateCount = Object.keys(certificate).length
    const certificateLength = new String(certificateCount)
    res.json(certificateLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/certificate/delete
// @desc   Delete a certificate
// @access Private
router.post('/delete', requireAuth, async (req, res) => {
  const { id, publicId } = req.body
  if (publicId.includes('image')) {
    try {
      const response = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: 'image'
      })
      if (response.error || response.result === 'not found') {
        res.json({ error: `'Image' requested not found` })
        return
      }
      if (response.result === 'ok') {
        const certificate = await Certificate.findByIdAndDelete({ _id: id })
        if (!certificate) {
          res.json({ error: `"Certificate" requested not found` })
          return
        }
        res.json(certificate)
        return
      }
    } catch (error) {
      console.log(error)
      return
    }
  } else {
    try {
      const response = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: 'raw'
      })
      if (response.error || response.result === 'not found') {
        res.json({ error: `'Document' requested not found` })
        return
      }
      if (response.result === 'ok') {
        const certificate = await Certificate.findByIdAndDelete({ _id: id })
        if (!certificate) {
          res.json({ error: `"Certificate" requested not found` })
          return
        }
        res.json(certificate)
        return
      }
    } catch (error) {
      console.log(error)
      return
    }
  }
})

// @route  GET /api/certificate/
// @desc   Get all current users certificates
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const certificate = await Certificate.find({ _user: req.user.id })
    res.json(certificate)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/certificate/:id
// @desc   Get one current user certificate
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
    if (!certificate) {
      res.json({ error: `'Certificate' requested not found` })
      return
    }
    res.json(certificate)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/certificate/
// @desc   Post a certificate
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { title, pdfUrl, photoUrl, publicId } = req.body
  try {
    const certificate = new Certificate({
      _user: req.user.id,
      title,
      pdfUrl,
      photoUrl,
      publicId
    })
    await certificate.save()
    res.json(certificate)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/certificate/:id
// @desc   Update a certificate
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    // Do update
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body
      },
      { new: true }
    )
    if (!certificate) {
      res.json({ error: `'Certificate' requested not found` })
      return
    }
    res.json(certificate)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
