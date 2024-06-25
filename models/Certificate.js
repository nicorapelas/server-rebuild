const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CertificateSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String
  },
  pdfUrl: {
    type: String
  },
  photoUrl: {
    type: String
  },
  publicId: {
    type: String
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  }
})

mongoose.model('Certificate', CertificateSchema)
