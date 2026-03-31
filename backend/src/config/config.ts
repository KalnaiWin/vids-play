export default () => ({
  jwt: {
    access: {
      secret: process.env.JWT_SECRET_ACCESS_KEY,
      expiresIn: process.env.JWT_EXPIRED_ACCESS,
    },
    refresh: {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.JWT_EXPIRED_REFRESH,
    },
  },
  database: {
    connectionString: process.env.MONGO_URI,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  firebase: {
    project_id: process.env.FIREBASE_PROJECT_ID,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
  },
});
