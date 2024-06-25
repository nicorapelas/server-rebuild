const express = require('express')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  POST /api/config/info
// @desc   Get config info
// @access Private
router.post('/info', requireAuth, async (req, res) => {
  const { info } = req.body
  if (info === 'tdData') {
    res.json({ id: keys.managment.id, pin: keys.managment.menuPin })
  }
})

module.exports = router
