const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RecipientSchema = new Schema({
  email: String,
  viewed: {
    type: Boolean,
    default: false,
  },
})

module.exports = RecipientSchema
