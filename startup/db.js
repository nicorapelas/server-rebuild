const mongoose = require('mongoose')

// DB Keys
const db = require('../config/keys').keys

module.exports = () => {
  // Connect to Mongodb
  mongoose
    .set('useFindAndModify', false)
    .set('useUnifiedTopology', true)
    .set('useCreateIndex', true)
    .set('useNewUrlParser', true)
    .connect(db.mongo.url(), db.mongo.options)
    .then(() => console.log(`Connected to MongoDB (MLab)...`))
}
