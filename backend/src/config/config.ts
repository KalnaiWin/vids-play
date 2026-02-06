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
});
