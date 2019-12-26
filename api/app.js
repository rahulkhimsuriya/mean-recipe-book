const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');

const AppError = require('./utils/appError');
const globaleErrorHandler = require('./utils/globaleErrorHandler');

const app = express();

const userRoute = require('./routes/userRoutes');
const recipeRoute = require('./routes/recipeRoutes');

// DotENV
dotenv.config({ path: './config.env' });

// MIDDLEWARES
// Cors
app.use(cors());
// Static folder
app.use('/public', express.static('public'));
// logger
app.use(morgan('dev'));
// BodyParser
app.use(express.json());

// ROUTES
app.use('/api/v1/users', userRoute);
app.use('/api/v1/recipes', recipeRoute);

// ERROR
app.use('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} route on this server.`, 404));
});

app.use(globaleErrorHandler);

// Exports App
module.exports = app;
