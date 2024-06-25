const express = require('express')
const mongoose = require('mongoose')
const Error = mongoose.model('Error')
const requireAuth = require('../../middlewares/requireAuth')

const router = express.Router()

// @route  POST /error/
// @desc   Post error
// @access Private
router.post('/', requireAuth, async (req, res) => {
  try {
    // Create error
    const error = new Error({
      _user: req.user.id,
      ...req.body
    })
    await error.save()
    res.json(error)
    return
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
