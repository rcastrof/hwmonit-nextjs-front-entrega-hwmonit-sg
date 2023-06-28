require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_RSA_KEY : process.env.REACT_APP_RSA_KEY,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SELF_URL: process.env.NEXT_PUBLIC_SELF_URL,
    REACT_APP_SEED: process.env.REACT_APP_SEED,
    LIMIT_ZONES: process.env.LIMIT_ZONES,
    LIMIT_BRANCHES: process.env.LIMIT_BRANCHES,
    LIMIT_MONITOR: process.env.LIMIT_MONITOR,
    LIMIT_DEVICE_TYPE: process.env.LIMIT_DEVICE_TYPE,
    LIMIT_DEVICES: process.env.LIMIT_DEVICES
  }
}
