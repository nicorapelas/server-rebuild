const express = require('express')
const mongoose = require('mongoose')
const async = require('async')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const path = require('path')
const nodemailer = require('nodemailer')
var hbs = require('nodemailer-express-handlebars')
const User = mongoose.model('User')
const Attribute = mongoose.model('Attribute')
const Certificate = mongoose.model('Certificate')
const ContactInfo = mongoose.model('ContactInfo')
const EmployHistory = mongoose.model('EmployHistory')
const Experience = mongoose.model('Experience')
const Interest = mongoose.model('Interest')
const Language = mongoose.model('Language')
const PersonalInfo = mongoose.model('PersonalInfo')
const PersonalSummary = mongoose.model('PersonalSummary')
const Photo = mongoose.model('Photo')
const Reference = mongoose.model('Reference')
const SecondEdu = mongoose.model('SecondEdu')
const Skill = mongoose.model('Skill')
const TertEdu = mongoose.model('TertEdu')
const CurriculumVitae = mongoose.model('CurriculumVitae')
const FirstImpression = mongoose.model('FirstImpression')
const Affiliate = mongoose.model('Affiliate')
const keys = require('../../config/keys').keys
const requireAuth = require('../../middlewares/requireAuth')
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')
const validateEmailInput = require('../../validation/email')
const validatePasswordReset = require('../../validation/passwordReset')
const resetPasswordEmail = require('../../templates/mailTemplates/resetPasswordEmail')
const MailerAuth = require('../../services/MailerAuth')
const verifyEmail = require('../../templates/mailTemplates/verifyEmail')

const router = express.Router()

cloudinary.config({
  cloud_name: keys.cloudinary.cloud_name,
  api_key: keys.cloudinary.api_key,
  api_secret: keys.cloudinary.api_secret,
})

// Nodemailer Handlebars
const handlebarOptions = {
  viewEngine: {
    extName: '.handlebars',
    partialsDir: path.resolve('./templates/mailTemplates'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./templates/mailTemplates'),
  extName: '.handlebars',
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: keys.google.authenticateUser,
    pass: keys.google.authenticatePassword,
  },
})
transporter.use('compile', hbs(handlebarOptions))
// Register mailer options
mailManRegister = (email, id) => {
  const mailOptionsRegister = {
    from: 'nicorapelas@cvcloud.com',
    to: email,
    subject: 'CV Cloud - User authentication',
    template: 'verifyEmailTemplate',
    context: {
      id,
    },
  }
  transporter.sendMail(mailOptionsRegister, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}
// Forgot password mailer options
mailManForgotPassword = (email, token) => {
  const mailOptionsForgotPassword = {
    from: 'nicorapelas@cvcloud.com',
    to: email,
    subject: 'CV Cloud - User authentication',
    template: 'resetPasswordTemplate',
    context: {
      token,
    },
  }
  transporter.sendMail(mailOptionsForgotPassword, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Email sent: ' + info.response)
    }
  })
}

// @route  POST /auth/user/fetch-user
// @desc   Fetch current user
// @access public
router.get('/fetch-user', requireAuth, (req, res) => {
  try {
    const user = req.user
    if (!user) {
      res.json({ error: 'no user' })
      return
    } else {
      // Destructure the user object to exclude the 'recipients' field
      const { recipients, ...userWithoutRecipients } = user.toObject()
      res.json(userWithoutRecipients)
      return
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' })
  }
})

// @route  POST /auth/user/terms-conditions
// @desc   Update users terms and conditions
// @access private
router.post('/term-conditions', requireAuth, async (req, res) => {
  const { accepted } = req.body
  const { _id } = req.user
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      {
        termsAndConditionsAccepted: accepted,
      },
      { new: true }
    )
    res.json(user)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// @route  POST /auth/user/register
// @desc   Register a user and respond with JWT
// @access public
router.post('/register', async (req, res) => {
  // Validation check
  const { errors, isValid } = validateRegisterInput(req.body)
  if (!isValid) {
    res.json({ error: errors })
    return
  }
  // Check if User exists
  const userCheck = await User.findOne({ email: req.body.email })
  if (userCheck) {
    if (userCheck.facebookId) {
      errors.email = 'Login with Facebook'
      res.json({ error: errors })
      return
    }
  }
  if (userCheck) {
    errors.email = 'Email already in use'
    res.json({ error: errors })
    return
  }
  const { email, password, fullName, affiliatceIntroCode } = req.body
  try {
    // Create user
    const newUser = new User({
      username: email,
      email,
      password,
      affiliatceIntroCode,
      localId: true,
      recipients: { email },
      created: Date.now(),
    })
    // Send verification email
    mailManRegister(email, newUser._id)
    await newUser.save()
    const newPersonalInfo = new PersonalInfo({
      _user: newUser._id,
      fullName,
    })
    await newPersonalInfo.save()
    const newContactInfo = new ContactInfo({
      _user: newUser._id,
      email,
    })
    await newContactInfo.save()
    return res.send({
      success: `An 'email verification' email has been sent to you. Please open the email and follow the provided instructions.`,
    })
  } catch (err) {
    return res.send(err.message)
  }
})

// @route  GET /auth/user/login
// @desc   Login a user and respond with JWT
// @access public
router.post('/login', async (req, res) => {
  // Validation check
  const { errors, isValid } = validateLoginInput(req.body)
  if (!isValid) {
    res.json({ error: errors })
    return
  }
  const { email, password } = req.body
  // Check if user with email registered
  const user = await User.findOne({ email })
  if (!user) {
    errors.email = 'Invalid email or password'
    res.json({ error: errors })
    return
  }
  // Check if users email verified
  if (!user.emailVerified) {
    res.json({
      error: { notVerified: 'Email address not yet verified' },
    })
    return
  }
  try {
    await user.comparePassword(password)
    const token = jwt.sign({ userId: user._id }, keys.JWT.secret)
    res.json({ token })
  } catch (err) {
    errors.password = 'Invalid email or password'
    res.json({ error: errors })
    return
  }
})

const signToken = (userID) => {
  return jwt.sign(
    {
      iss: 'NoobCoder',
      sub: userID,
    },
    'NoobCoder',
    { expiresIn: '1h' }
  )
}

// @route  POST /auth/user/login-web
// @desc   Login a user and respond with JWT
// @access public
router.post(
  '/login-web',
  passport.authenticate('local', { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role } = req.user
      const token = signToken(_id)
      res.cookie('access_token', token, { httpOnly: true, sameSite: true })
      res.status(200).json({ isAuthenticated: true, user: { username, role } })
    }
  }
)

// @route  Get /auth/user/email-verified/:id
// @desc   Set emailVerified to true
// @access public
router.post('/verify-email/', async (req, res) => {
  try {
    const { id } = req.body
    const user = await User.findById(id)
    if (!user) {
      res.json({ error: `"User" not found` })
      return
    }
    await User.findByIdAndUpdate(
      id,
      {
        emailVerified: true,
      },
      { new: true }
    )
    const photo = await Photo.find({ id })
    const certificate = await Certificate.find({ id })
    const attribute = await Attribute.find({ id })
    const contactInfo = await ContactInfo.find({ id })
    const employHistory = await EmployHistory.find({ id })
    const experience = await Experience.find({ id })
    const firstImpression = await FirstImpression.find({ id })
    const interest = await Interest.find({ id })
    const language = await Language.find({ id })
    const personalInfo = await PersonalInfo.find({ id })
    const personalSummary = await PersonalSummary.find({ id })
    const reference = await Reference.find({ id })
    const secondEdu = await SecondEdu.find({ id })
    const skill = await Skill.find({ id })
    const tertEdu = await TertEdu.find({ id })
    const curriculumVitae = new CurriculumVitae({
      _photo: photo,
      _attribute: attribute,
      _contactInfo: contactInfo,
      _certificate: certificate,
      _employHistory: employHistory,
      _experience: experience,
      _firstImpression: firstImpression,
      _interest: interest,
      _language: language,
      _personalInfo: personalInfo,
      _personalSummary: personalSummary,
      _reference: reference,
      _secondEdu: secondEdu,
      _skill: skill,
      _tertEdu: tertEdu,
      _user: id,
    })
    console.log(`Users first 'CurriculumVitae' document created`)
    await curriculumVitae.save()
    res.json({ success: `Email veryfied` })
    return
  } catch (err) {
    console.log(err)
    return
  }
})

// @route  POST /auth/user/resend-verification-email
// @desc   Resend verification email
// @access public
router.post('/resend-verification-email', async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  const newUser = new User({
    _id: user._id,
    recipients: { email },
  })
  // Send verification email
  try {
    await mailManRegister(email, newUser._id)
    res.json({
      success: `An 'email verification' email has been sent to you. Please open the email and follow the provided instructions.`,
    })
    return
  } catch (err) {
    res.json(err)
    console.log(err)
    return
  }
})

// @route  POST /auth/user/forgot
// @desc   Post to forgot password
// @access public
router.post('/forgot', (req, res) => {
  const { email } = req.body
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        const token = buf.toString('hex')
        done(err, token)
      })
    },
    (token, done) => {
      const { errors, isValid } = validateEmailInput(email)
      if (!isValid) {
        res.json({ error: errors })
        return
      }
      User.findOne({ email }, (err, user) => {
        if (!user) {
          errors.email = 'Email address not registered'
          res.json({ error: errors })
          return
        }
        if (user.googleId) {
          res.json({
            error: {
              warn: `You've previously registered using Google, please login using Google`,
            },
          })
          return
        }
        if (user.facebookId) {
          res.json({
            error: {
              warn: `You've previously registered using Facebook, please login using Facebook`,
            },
          })
          return
        }
        user.recipients = { email }
        user.resetPasswordToken = token
        user.resetPasswordExpires = Date.now() + 3600000
        user.save((err) => {
          done(err, token, user)
        })
      })
    },
    async (token) => {
      // Send email for verification and save user
      try {
        await mailManForgotPassword(email, token)
        res.json({
          success: `A "password reset" email was sent to you. Please view the email and click on the provided "Reset password"
        link, within the email.`,
        })
        return
      } catch (err) {
        res.json(err)
        console.log(err)
        return
      }
    },
  ])
})

router.get('/reset/:token', (req, res) => {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    (err, user) => {
      if (!user) {
        res.json(err)
        return
      }
      res.redirect(`http://localhost:3000/reset-password/${req.params.token}`)
      return
    }
  )
})

router.post('/reset', (req, res) => {
  const { password, token } = req.body
  async.waterfall(
    [
      (done) => {
        User.findOne(
          {
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          (err, user) => {
            if (!user) {
              res.json({
                error: {
                  token:
                    'Reset token has expired, please try reseting your password again',
                },
              })
              return
            }
            // Validation check
            const { errors, isValid } = validatePasswordReset(req.body)
            if (!isValid) {
              console.log(errors)
              res.json({ error: errors })
              return
            }
            user.password = password
            user.resetPasswordToken = undefined
            user.resetPasswordExpires = undefined
            user
              .save()
              .then(res.json({ success: 'Password reset succefull' }))
              .catch((err) => err)
            return
          }
        )
      },
    ],
    (err) => {
      res.json(err)
      console.log(err)
      return
    }
  )
})

// @route  PATCH /auth/visit-count/:id
// @desc   Update users visit count
// @access Private
router.patch('/visit-count', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const { visitCount } = user
    // Do update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        visitCount: visitCount + 1,
      },
      { new: true }
    )
    res.json(updatedUser)
    return
  } catch (error) {
    console.log(error)
    return
  }
})

// *** Admin use ***
// @route  PATCH /auth/visit-count
// @desc   Update users visit count
// @access Private
router.patch('/create-affiliate', requireAuth, async (req, res) => {
  const { userEmail } = req.body
  const { _id } = req.user
  const { id } = keys.managment
  if (_id.equals(id)) {
    try {
      const user = await User.findOne({ email: userEmail })
      if (!user) {
        res.json({ error: `'User' not found` })
        return
      }
      if (user.affiliate) {
        res.json({ success: `'User' already an affiliate` })
        return
      }
      const userContactInfo = await ContactInfo.findOne({
        _user: user._id,
      })
      if (!userContactInfo.email || !userContactInfo.phone) {
        res.json({ error: 'insufficient contact info' })
        return
      }
      const userPersonalInfo = await PersonalInfo.findOne({
        _user: user._id,
      })
      if (!userPersonalInfo.fullName) {
        res.json({ error: 'insufficient personal info' })
        return
      }
      // Creact affiliate
      const affiliate = new Affiliate({
        _user: user._id,
        name: userPersonalInfo.fullName,
        phone: userContactInfo.phone,
        email: userContactInfo.email,
        code:
          userPersonalInfo.fullName.slice(0, 2).toLowerCase() +
          userContactInfo.phone.slice(5, 10),
      })
      await affiliate.save()
      console.log(affiliate)
      // Do update
      const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
          affiliate: true,
        },
        { new: true }
      )
      res.json({
        success: `${updatedUser.email} updated to affiliate successfully`,
      })
      return
    } catch (error) {
      console.log(error)
      return
    }
  }
  res.json({ error: 'User not authorized for action' })
  return
})

// *** Admin use ***
// @route  POST /auth/fetch-affiliate-info
// @desc   Fetch users affiliation info
// @access Private
router.post('/fetch-affiliate-info', requireAuth, async (req, res) => {
  const { userEmail } = req.body
  console.log(req.body)
  const { _id } = req.user
  const { id } = keys.managment
  if (_id.equals(id)) {
    try {
      const affiliate = await Affiliate.findOne({ email: userEmail })
      if (!affiliate) {
        res.json({ error: `'Affiliate info' not found` })
        return
      }
      res.json(affiliate)
      return
    } catch (error) {
      console.log(error)
      return
    }
  }
  res.json({ error: 'User not authorized for action' })
  return
})

// *** Admin use ***
// @route  GET /auth/fetch-all-affiliates
// @desc   Fetch all affiliates
// @access Private
router.get('/fetch-affiliates', requireAuth, async (req, res) => {
  const { _id } = req.user
  const { id } = keys.managment
  if (_id.equals(id)) {
    try {
      const affiliates = await Affiliate.find()
      console.log(affiliates)
      if (!affiliates) {
        res.json({ error: `No 'Affiliates' found` })
        return
      }
      res.json(affiliates)
      return
    } catch (error) {
      console.log(error)
      return
    }
  }
  res.json({ error: 'User not authorized for action' })
  return
})

// @route  POST /auth/apply-to-intro
// @desc   Check level of completion an apply to introComplete accordingly
// @access Private
router.patch('/apply-to-intro', requireAuth, async (req, res) => {
  const { introComplete, affiliatceIntroCode } = req.user
  if (introComplete) {
    res.send({ msg: `'inroComplete' is true` })
    return
  }
  if (!affiliatceIntroCode || affiliatceIntroCode.length < 1) {
    // Do update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        introComplete: true,
      },
      { new: true }
    )
    res.json(updatedUser)
    return
  }
  const firstImpression = await FirstImpression.find({ _user: req.user })
  const photo = await Photo.find({ _user: req.user })
  const secondEdu = await SecondEdu.find({ _user: req.user })
  const tertEdu = await TertEdu.find({ _user: req.user })
  const language = await Language.find({ _user: req.user })
  const attribute = await Attribute.find({ _user: req.user })
  const employHistory = await EmployHistory.find({ _user: req.user })
  const experience = await Experience.find({ _user: req.user })
  const skill = await Skill.find({ _user: req.user })
  const interest = await Interest.find({ _user: req.user })
  const reference = await Reference.find({ _user: req.user })
  const certificate = await Certificate.find({ _user: req.user })
  const personalInfo = await PersonalInfo.find({ _user: req.user })
  const contactInfo = await ContactInfo.find({ _user: req.user })
  // Check CV bits status
  if (!contactInfo || contactInfo.length < 1) {
    res.json({ error: `insufficient 'ContactInfo'` })
    return
  }
  const { phone, email, city } = contactInfo[0]
  const scorePhone = !phone || phone.length < 1 ? 0 : 1
  const scoreEmail = !email || email.length < 1 ? 0 : 1
  const scoreCity = !city || city.length < 1 ? 0 : 1
  const scoreContactInfo = scorePhone + scoreEmail + scoreCity < 3 ? 0 : 1
  if (scoreContactInfo === 0) {
    res.json({ error: `insufficient 'ContactInfo'` })
    return
  }
  if (!personalInfo || personalInfo.length < 1) {
    res.json({ error: `insufficient 'PersonalInfo'` })
    return
  }
  const { fullName, dateOfBirth } = personalInfo[0]
  const scoreFullName = !fullName || fullName.length < 1 ? 0 : 1
  const scoreDateOfBirth = !dateOfBirth || dateOfBirth.length < 1 ? 0 : 1
  const scorePersonalInfo = scoreFullName + scoreDateOfBirth < 2 ? 0 : 1
  if (scorePersonalInfo === 0) {
    res.json({ error: `insufficient 'PersonalInfo'` })
    return
  }
  const scoreFirstImpression =
    !firstImpression || firstImpression.length < 1 ? 0 : 1
  const scorePhoto = !photo || photo.length < 1 ? 0 : 1
  const scoreSeconEdu = !secondEdu || secondEdu.length < 1 ? 0 : 1
  const scoreTertEdu = !tertEdu || tertEdu.length < 1 ? 0 : 1
  const scoreLanguage = !language || language.length < 2 ? 0 : 1
  const scoreAttribute = !attribute || attribute.length < 2 ? 0 : 1
  const scoreEmployHistory = !employHistory || employHistory.length < 1 ? 0 : 1
  const scoreExperience = !experience || experience.length < 1 ? 0 : 1
  const scoreSkill = !skill || skill.length < 2 ? 0 : 1
  const scoreInterest = !interest || interest.length < 2 ? 0 : 1
  const scoreReference = !reference || reference.length < 1 ? 0 : 1
  const scoreCertificate = !certificate || certificate.length < 1 ? 0 : 1
  if (
    scoreFirstImpression +
      scorePhoto +
      scoreSeconEdu +
      scoreTertEdu +
      scoreLanguage +
      scoreAttribute +
      scoreEmployHistory +
      scoreExperience +
      scoreSkill +
      scoreInterest +
      scoreReference +
      scoreCertificate <
    7
  ) {
    res.json({ error: 'more data deeded to complete intro' })
    return
  }
  // Do update
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      introComplete: true,
    },
    { new: true }
  )
  const affiliate = await Affiliate.findOne({ code: affiliatceIntroCode })
  if (!affiliate || affiliate.length < 1) {
    res.json({ error: 'Affiliate code incorrect' })
    return
  }
  const { introductions } = affiliate
  await Affiliate.findOneAndUpdate(
    { code: affiliatceIntroCode },
    {
      introductions: introductions + 1,
    },
    { new: true }
  )
  res.json(updatedUser)
  return
})

const deleteCloudinaryGoods = (publicId) => {
  publicId.map(async (pId) => {
    if (pId.includes('photo')) {
      try {
        const response = await cloudinary.v2.uploader.destroy(pId, {
          resource_type: 'image',
        })
        if (response.error || response.result === 'not found') {
          console.log({ error: `'Image' requested not found` })
        }
      } catch (error) {
        console.log(error)
        return
      }
    }
    if (pId.includes('image')) {
      try {
        const response = await cloudinary.v2.uploader.destroy(pId, {
          resource_type: 'image',
        })
        if (response.error || response.result === 'not found') {
          console.log({ error: `'Image' requested not found` })
        }
      } catch (error) {
        console.log(error)
        return
      }
    }
    if (pId.includes('video')) {
      try {
        const response = await cloudinary.v2.uploader.destroy(pId, {
          resource_type: 'video',
        })
        if (response.error || response.result === 'not found') {
          console.log({ error: `'Image' requested not found` })
        }
      } catch (error) {
        console.log(error)
        return
      }
    }
    if (pId.includes('pdf')) {
      try {
        const response = await cloudinary.v2.uploader.destroy(pId, {
          resource_type: 'raw',
        })
        if (response.error || response.result === 'not found') {
          console.log({ error: `'Document' requested not found` })
        }
      } catch (error) {
        console.log(error)
        return
      }
    }
  })
}

// @route  DELETE /auth/delete-account
// @desc   Delete a users account
// @access Private
router.delete('/delete-account', requireAuth, async (req, res) => {
  // Delete certificates
  const certificates = await Certificate.find({ _user: req.user.id })
  const certificatePublicIds = certificates.map((certificate) => {
    return certificate.publicId
  })
  deleteCloudinaryGoods(certificatePublicIds)
  await Certificate.deleteMany({ _user: req.user.id })
  // Delete photos
  const photos = await Photo.find({ _user: req.user.id })
  const photoPublicIds = photos.map((photo) => {
    return photo.publicId
  })
  deleteCloudinaryGoods(photoPublicIds)
  await Photo.deleteMany({ _user: req.user.id })
  // Delete first impression video
  const firstImpressions = await FirstImpression.find({ _user: req.user.id })
  const firstImpressionPublicIds = firstImpressions.map((firstImpression) => {
    return firstImpression.publicId
  })
  deleteCloudinaryGoods(firstImpressionPublicIds)
  await FirstImpression.deleteMany({ _user: req.user.id })
  // Delete all collections
  await Attribute.deleteMany({ _user: req.user.id })
  await ContactInfo.deleteMany({ _user: req.user.id })
  await EmployHistory.deleteMany({ _user: req.user.id })
  await Experience.deleteMany({ _user: req.user.id })
  await Interest.deleteMany({ _user: req.user.id })
  await Language.deleteMany({ _user: req.user.id })
  await PersonalInfo.deleteMany({ _user: req.user.id })
  await PersonalSummary.deleteMany({ _user: req.user.id })
  await Reference.deleteMany({ _user: req.user.id })
  await SecondEdu.deleteMany({ _user: req.user.id })
  await Skill.deleteMany({ _user: req.user.id })
  await TertEdu.deleteMany({ _user: req.user.id })
  await User.findByIdAndDelete({ _id: req.user.id })
  res.json({ success: 'User successfully deleted' })
})

module.exports = router

// Make template for expired email verification token
