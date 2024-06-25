const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const RecipientSchema = require('./Recipient')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String
  },
  localId: {
    type: Boolean,
    default: false
  },
  googleId: {
    type: Boolean,
    default: false
  },
  facebookId: {
    type: Boolean,
    default: false
  },
  facebookIdNumber: {
    type: String
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  termsAndConditionsAccepted: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  avatar: {
    type: String,
    default: ''
  },
  affiliate: {
    type: Boolean,
    default: false
  },
  affiliatceIntroCode: {
    type: String
  },
  credits: {
    type: Number,
    default: 0
  },
  visitCount: {
    type: Number,
    default: 1
  },
  introAffiliateCode: {
    type: String
  },
  introComplete: {
    type: Boolean,
    default: false
  },
  recipients: [RecipientSchema],
  created: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function(candidatePassword) {
  const user = this

  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      if (!isMatch) {
        return reject(false)
      }
      resolve(true)
    })
  })
}

mongoose.model('User', userSchema)
