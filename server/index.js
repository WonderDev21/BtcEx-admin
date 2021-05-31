const express = require('express');
const path = require('path');
const webpack = require('webpack');
const basicAuth = require('basic-auth');
const compression = require('compression');
const proxy = require('express-http-proxy');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { BACKEND_SERVER_PATH, JOB_SERVER_PATH } = require('./config');

const app = express();
const PORT = process.env.PORT || 9000;
const __DEBUG__ =
  process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development';
app.use(helmet());
app.use(cookieParser());
app.use(compression());
app.use(express.static(path.join(process.cwd(), 'dist')));
app.use(express.static(path.join(process.cwd(), 'public')));
app.set('x-powered-by', false);
if (__DEBUG__) {
  const webpackDevConfig = require('../webpack/webpack.config.dev-client');
  const compiler = webpack(webpackDevConfig);
  app.use(
    require('webpack-dev-middleware')(compiler, { // eslint-disable-line
      noInfo: true,
      publicPath: webpackDevConfig.output.publicPath,
    })
  );
  app.use(require('webpack-hot-middleware')(compiler)); // eslint-disable-line
}
const AdminAuth = (req, resp, next) => {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  }
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return unauthorized(resp);
  }
  const authUsers = {
    'Vikramaditya Kokil': '63741825',
    kevin394005: 'ihST$*3W6%$Zze',
  };
  if (authUsers[user.name] && user.pass === authUsers[user.name]) {
    return next();
  }
  return unauthorized(resp);
};
// app.use(AdminAuth);
app.use(
  '/api',
  proxy(BACKEND_SERVER_PATH, {
    limit: '20mb',
  })
);
// app.use('/job', proxy(JOB_SERVER_PATH));
app.get('/*', AdminAuth, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public/index.html'));
});
app.listen(PORT, () => {
  console.log(`===>  Listening on port: ${PORT} ENV = ${process.env.NODE_ENV}`);
});
