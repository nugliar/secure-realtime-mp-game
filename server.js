require('dotenv').config();
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const helmet = require('helmet');
const fs = require('fs');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const ioSocket = require('./io/ioSocket.js')

const app = express();
const httpServer = http.createServer(app);
const io = socket(httpServer);

app.use(helmet.noSniff());
app.use(helmet.hsts());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'"],
      "style-src": ["'self'"],
      "img-src": ["'self'"]
    },
  })
);

// no cache, fake powered-by
app.use(function (req, res, next) {
  res.header('X-Powered-By', 'PHP 7.4.3');
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use('/socket.io', express.static(process.cwd() + '/socket.io'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

ioSocket(io);

const portNum = process.env.PORT || 3000;

// Set up server and tests
httpServer.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // For testing
