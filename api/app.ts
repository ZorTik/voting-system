var express = require('express');
var cookieParser = require('cookie-parser');

let indexRouter = require('./controllers/index');
let accountRouter = require('./controllers/account');
let serverRouter = require('./controllers/server');
let serversRouter = require('./controllers/servers');
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/server', serverRouter);
app.use('/servers', serversRouter);

module.exports = app;
