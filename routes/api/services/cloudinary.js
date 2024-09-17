const express = require('express')
const cloudinary = require('cloudinary').v2
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret,
})

// @route  POST /api/cloudinary/signature-request
// @desc   Generate an upload signature
// @access Private
router.post('/signature-request-no-preset', requireAuth, async (req, res) => {
  console.log(`yebo:`, req.body)
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
    },
    keys.cloudinary.api_secret
  )
  const payload = {
    apiKey: keys.cloudinary.api_key,
    signature,
    timestamp,
  }
  if (!payload.signature) {
    res.json({ error: 'signature request failed' })
    return
  }
  res.json(payload)
  return
})

router.post(
  '/signature-request-photo-preset',
  requireAuth,
  async (req, res) => {
    const timestamp = Math.round(Date.now() / 1000)
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        upload_preset: 'photo',
      },
      keys.cloudinary.api_secret
    )
    const payload = {
      apiKey: keys.cloudinary.api_key,
      signature,
      timestamp,
    }
    if (!payload.signature) {
      res.json({ error: 'signature request failed' })
      return
    }
    res.json(payload)
    return
  }
)

module.exports = router
