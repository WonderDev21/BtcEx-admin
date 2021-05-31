const dotEnv = require('dotenv');

dotEnv.config();
const config = {
  BACKEND_SERVER_PATH:
    process.env.BACKEND_SERVER_PATH || 'http://www.chiprally.in',
  JOB_SERVER_PATH: process.env.JOB_SERVER_PATH || 'http://job.coinmint.in',
};
module.exports = config;
