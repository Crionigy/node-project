const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const app = express();

//#region MongoDb

//Connection string with the database {MongoDb}
mongoose.connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb/node-angular', {useNewUrlParser: true})
.then(() => {
    console.log('Successfully connected to MongoDB!');
})
.catch((e) => {
    console.log('Error, ' + e.message);
})

//#endregion

//#region Configs
app.use(bodyParser.json());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS, PUT'
    );
  
    next();
});
//#endregion

//#region Routes

app.use('/api', indexRouter);
app.use('/api/posts', postsRouter);

//#endregion

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
