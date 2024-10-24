const keys = {
  mongo: {
    url: function() {
      return process.env.MONGO_URI
    },
    options: {
      useNewUrlParser: true
    }
  },
  cookie: {
    secret: process.env.COOKIE_KEY
  },
  JWT: {
    secret: process.env.SECRET_OR_KEY
  },
  google: {
    shareCvUser: process.env.GOOGLE_SHARE_CV_USER,
    shareCvPassword: process.env.GOOGLE_SHARE_CV_PASSWORD,
    authenticateUser: process.env.GOOGLE_AUTHENTICATE_USER,
    authenticatePassword: process.env.GOOGLE_AUTHENTICATE_PASSWORD
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_SECRET_OR_KEY,
    callbackURL: process.env.FACEBOOK_CALLBACK
  },
  amazonS3Buckets: {
    accessKeyId: process.env.AMAZON_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AMAZON_S3_SECRET_ACCESS_KEY,
    photoBucketUrl: process.env.PHOTO_BUCKET_URL,
    certificateBucketUrl: process.env.CERTIFICATE_BUCKET_URL
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECTER,
    demo_video_url: process.env.VIDEO_DEMO_URL
  },
  sendgrid: {
    apiKey: process.env.SEND_GRID_KEY,
    redirectDomain: process.env.REDIRECTR_DOMAIN,
    user: process.env.SENDGRID_USER,
    pass: process.envSENDGRID_PASS
  },
  domain: {
    url: process.env.DOMAIN_URL
  },
  authPrefix: {
    url: process.env.AUTH_PREFIX
  },
  managment: {
    id: process.env.TD_ID,
    menuPin: process.env.TD_MENU_PIN
  },
  sampleCv: {
    id: process.env.SAMPLE_CV_ID
  },
  latestAppVersion: {
    v: process.env.LATEST_APP_VERSION
  }
}

exports.keys = keys
