const express = require('express')
const mongoose = require('mongoose')
const requireAuth = require('../../middlewares/requireAuth')
const Affiliate = mongoose.model('Affiliate')
const User = mongoose.model('User')

const router = express.Router()

// @route  GET /api/affiliate/affiliate-info/
// @desc   Get all current users affiliate info
// @access Private
router.get('/info', requireAuth, async (req, res) => {
  try {
    const affiliate = await Affiliate.find({ _user: req.user.id })
    if (!affiliate || affiliate.length < 1) {
      res.json({ error: `User has made no intro's` })
      return
    }
    res.json(affiliate)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  GET /api/affiliate/affiliate-info/
// @desc   Get all current users affiliate info
// @access Private
router.get('/intros', requireAuth, async (req, res) => {
  try {
    const affiliate = await Affiliate.find({ _user: req.user.id })
    if (!affiliate || affiliate.length < 1) {
      res.json({ error: `'Affiliate' not found` })
      return
    }
    const { code } = affiliate[0]
    const users = await User.find()
    const usersAttachedAffiliateCode = users.filter(user => {
      return user.affiliatceIntroCode === code
    })
    res.json(usersAttachedAffiliateCode)
    return
  } catch (err) {
    console.log(err)
    return
  }
})

module.exports = router
