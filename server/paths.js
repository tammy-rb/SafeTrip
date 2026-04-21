const path = require('path');

const SERVER_ROOT = __dirname;
const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..');
const ENV_PATH = path.join(PROJECT_ROOT, '.env');

module.exports = {
  SERVER_ROOT,
  PROJECT_ROOT,
  ENV_PATH,
};
