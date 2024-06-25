const express = require('express')
const path = require('path')
const nodemailer = require('nodemailer')
const keys = require('../../../config/keys').keys
const requireAuth = require('../../../middlewares/requireAuth')
var hbs = require('nodemailer-express-handlebars')

const router = express.Router()

const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./templates/mailTemplates'),
    defaultLayout: false
  },
  viewPath: path.resolve('./templates/mailTemplates'),
  extName: '.handlebars'
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: keys.google.shareCvUser,
    pass: keys.google.shareCvPassword
  }
})

transporter.use('compile', hbs(handlebarOptions))

mailMan = (
  recipient,
  message,
  subject,
  curriculumVitaeID,
  assignedPhotoUrl
) => {
  const mailOptions = {
    from: 'nicorapelas@cvcloud.com',
    to: recipient,
    subject: subject,
    template: assignedPhotoUrl ? 'shareCvTemplate' : 'shareCvNoPhotoTemplate',
    context: {
      message,
      curriculumVitaeID,
      assignedPhotoUrl
    }
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
    }
    if (info) {
      console.log(info)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

router.post('/', async (req, res) => {
  const {
    message,
    subject,
    recipients,
    curriculumVitaeID,
    assignedPhotoUrl
  } = req.body
  recipients.map(recipient => {
    mailMan(
      recipient.email,
      message,
      subject,
      curriculumVitaeID,
      assignedPhotoUrl
    )
  })
  res.json({ msg: 'done' })
})

module.exports = router
