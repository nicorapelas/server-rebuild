require('./models/User')
require('./models/PersonalInfo')
require('./models/ContactInfo')
require('./models/PersonalSummary')
require('./models/EmployHistory')
require('./models/Experience')
require('./models/SecondEdu')
require('./models/TertEdu')
require('./models/Language')
require('./models/Skill')
require('./models/Attribute')
require('./models/Interest')  
require('./models/Reference')
require('./models/Photo')
require('./models/Certificate')
require('./models/ShareCV')
require('./models/CurriculumVitae')
require('./models/FirstImpression')
require('./models/Device')
require('./models/Affiliate')
require('./models/Error')
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const cookieParser = require('cookie-parser')

// Run Express
const app = express()

app.use(cookieParser())

require('./startup/routes')(app)
require('./startup/db')()

// Handlebars middleware
app.engine(
  'handlebars',
  handlebars({
    layoutsDir: __dirname + '/views/layouts'
  })
)

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Production Setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}
// Server Port
const port = process.env.PORT || 5000
const server = app.listen(port, () => console.log(`Listening on port ${port}`))
module.exports = server
