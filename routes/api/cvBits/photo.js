const express = require('express')
const cloudinary = require('cloudinary')
const mongoose = require('mongoose')
const Photo = mongoose.model('Photo')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret,
})

// @route  GET /api/photo/assigned
// @desc   Get a photo
// @access Private
router.get('/assigned', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.find({ _user: req.user.id })
    if (!photo) {
      res.json({ error: `'Assigned image' requested not found` })
      return
    }
    const assignedPhoto = photo.filter((ph) => {
      return ph.assigned === true
    })
    if (!assignedPhoto || assignedPhoto.length === 0) {
      res.json('noneAssigned')
      return
    }
    // Return deleted photo
    res.json(assignedPhoto[0].photoUrl)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/photo/sample
// @desc   Get sample photo
// @access Private
router.get('/sample', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.find({ _user: keys.sampleCv.id })
    if (!photo) {
      res.json({ error: `'Assigned image' requested not found` })
      return
    }
    const assignedPhoto = photo.filter((ph) => {
      return ph.assigned === true
    })
    if (!assignedPhoto || assignedPhoto.length === 0) {
      res.json('noneAssigned')
      return
    }
    // Return deleted photo
    res.json(assignedPhoto[0].photoUrl)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/photo/status
// @desc   Get current users photo collection length
// @access Private
router.get('/status', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.find({ _user: req.user.id })
    const photoCount = Object.keys(photo).length
    const photoLength = new String(photoCount)
    res.json(photoLength)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/photo/:id
// @desc   Get a photo
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
    if (!photo) {
      res.json({ error: `'Profile image' requested not found` })
      return
    }
    res.json(photo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// // @route  GET /api/photo/
// // @desc   Get a photo
// // @access Private
// router.get('/assigned', requireAuth, async (req, res) => {
//   try {
//     const photo = await Photo.find({ _user: req.user.id })
//     if (!photo) {
//       res.json({ error: `'Assigned image' requested not found` })
//       return
//     }
//     // Return deleted photo
//     res.json(photo)
//     return
//   } catch (error) {
//     console.log(error)
//     return
//   }
// })

// @route  POST /api/photo/assign-photo
// @desc   Assign photo to cv
// @access Private
router.post('/assign-photo', requireAuth, async (req, res) => {
  try {
    const photos = await Photo.find({ _user: req.user.id })
    const previousAssignedPhoto = photos.filter((photo) => {
      return photo.assigned === true
    })
    if (previousAssignedPhoto.length > 0) {
      await Photo.findByIdAndUpdate(previousAssignedPhoto[0]._id, {
        assigned: false,
      })
    }
    const newAssignedPhoto = await Photo.findByIdAndUpdate(req.body.id, {
      assigned: true,
    })
    res.json(newAssignedPhoto)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/photo/delete
// @desc   Delete a photo
// @access Private
router.post('/delete', requireAuth, async (req, res) => {
  const { id, publicId } = req.body
  try {
    const response = await cloudinary.v2.uploader.destroy(publicId, {
      resource_type: 'image',
    })
    if (response.error || response.result === 'not found') {
      res.json({ error: `'Image' requested not found` })
      return
    }
    if (response.result === 'ok') {
      const photo = await Photo.findByIdAndDelete({ _id: id })
      if (!photo) {
        res.json({ error: `"Photo" requested not found` })
        return
      }
      const photos = await Photo.find({ _user: req.user.id })
      res.json(photos)
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/photo/
// @desc   Get all current users photos
// @access Private
router.get('/', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.find({ _user: req.user.id })
    res.json(photo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  GET /api/photo/:id
// @desc   Get one current user photo
// @access Private
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
    if (!photo) return res.json({ error: `'Photo' requested not found` })
    res.json(photo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /api/photo/
// @desc   Post a photo
// @access Private
router.post('/', requireAuth, async (req, res) => {
  const { title, photoUrl, publicId } = req.body
  try {
    const usersPhotos = await Photo.find({ _user: req.user.id })
    if (usersPhotos.length < 1) {
      const photo = new Photo({
        _user: req.user.id,
        title,
        assigned: true,
        photoUrl,
        publicId,
      })
      await photo.save()
      const photos = await Photo.find({ _user: req.user.id })
      res.json(photos)
      return
    }
    const photo = new Photo({
      _user: req.user.id,
      title,
      photoUrl,
      publicId,
    })
    await photo.save()
    const photos = await Photo.find({ _user: req.user.id })
    res.json(photos)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  PATCH /api/photo/:id
// @desc   Update a photo
// @access Private
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    // Do update
    const photo = await Photo.findByIdAndUpdate(
      req.params.id,
      {
        _user: req.user.id,
        lastUpdate: new Date(),
        ...req.body,
      },
      { new: true }
    )
    if (!photo) {
      res.json({ error: `'Photo' requested not found` })
      return
    }
    res.json(photo)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
