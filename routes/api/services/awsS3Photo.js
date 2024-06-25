const express = require('express')
const router = express.Router()
const AWS = require('aws-sdk')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')

// @route  POST /api/photo-service/upload
// @desc   Get pre-signed url from AWS - Upload photo to s3 bucket
// @access Private
const s3 = new AWS.S3({
  accessKeyId: keys.amazonS3Buckets.accessKeyId,
  secretAccessKey: keys.amazonS3Buckets.secretAccessKey,
  region: 'eu-central-1'
})

// @route  POST /api/photo-service/delete-large-photo
// @desc   Post an aws files to delete, then delete from bucket
// @access Private
router.post('/delete-large-photo', requireAuth, async (req, res) => {
  const { imageFile } = req.body
  // Find file in AWS bucket & delete
  const params = {
    Bucket: 'cv-cloud-image-bucket/photo',
    Key: `${imageFile.name}`
  }
  try {
    await s3.headObject(params).promise()
    console.log('file found in S3 bucket')
    try {
      await s3.deleteObject(params).promise()
      console.log('file deleted successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('file not found ERROR : ' + err.code)
  }
  res.json(imageFile)
  return
})

// @route  POST /api/photo-service/delete-large-certificate
// @desc   Post an aws files to delete, then delete from bucket
// @access Private
router.post('/delete-large-certificate', requireAuth, async (req, res) => {
  const { imageFile } = req.body
  // Find file in AWS bucket & delete
  const params = {
    Bucket: 'cv-cloud-image-bucket/certificate',
    Key: `${imageFile.name}`
  }
  try {
    await s3.headObject(params).promise()
    console.log('file found in S3 bucket')
    try {
      await s3.deleteObject(params).promise()
      console.log('file deleted successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('file not found ERROR : ' + err.code)
  }
  res.json(imageFile)
  return
})

// @route  POST /api/photo-service/delete-photo
// @desc   Post an aws files to delete, then delete from bucket
// @access Private
router.post('/delete-photo', requireAuth, async (req, res) => {
  const { imageFile } = req.body
  // Find file in AWS bucket & delete
  const params = {
    Bucket: 'cv-cloud-image-bucket/photo',
    Key: `${imageFile.name}`
  }
  try {
    await s3.headObject(params).promise()
    console.log('file found in S3 bucket')
    try {
      await s3.deleteObject(params).promise()
      console.log('file deleted successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('file not found ERROR : ' + err.code)
  }
  res.json(imageFile)
  return
})

module.exports = router
