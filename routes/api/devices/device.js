const express = require('express')
const mongoose = require('mongoose')
const Device = mongoose.model('Device')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

const router = express.Router()

// @route  GET /auth/device/app-version
// @desc   Get latest app version
// @access public
router.get('/app-version', async (req, res) => {
  res.json(keys.latestAppVersion.v)
  return
})

// @route  POST /auth/device/
// @desc   Post users device info
// @access privat
router.post('/', requireAuth, async (req, res) => {
  const {
    deviceBrand,
    deviceModelName,
    osVersion,
    osInternalBuildId,
    deviceName
  } = req.body
  const device = new Device({
    _user: req.user.id,
    ...req.body
  })
  try {
    const usersDevices = await Device.find({ _user: req.user.id })
    if (!usersDevices || usersDevices.length < 1) {
      try {
        await device.save()
        res.json(device)
        return
      } catch (error) {
        console.log(error)
        return
      }
    }
    // Query unique
    const comparedDevices = usersDevices.filter(device => {
      return (
        device.deviceBrand === deviceBrand &&
        device.deviceModelName === deviceModelName &&
        device.osVersion === osVersion &&
        device.osInternalBuildId === osInternalBuildId &&
        device.deviceName === deviceName
      )
    })
    if (comparedDevices.length > 0) {
      res.json(device)
      return
    }
    try {
      await device.save()
      res.json(device)
      return
    } catch (error) {
      console.log(error)
      return
    }
  } catch (error) {
    console.log(error)
    return
  }
})

module.exports = router
