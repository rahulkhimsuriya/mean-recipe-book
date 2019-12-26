const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/users');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

// SignToken
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// SignUp
exports.signup = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  const newUser = await User.create({ firstname, lastname, email, password });
  res.status(201).json({ success: true, data: newUser });
});

// Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide us email and password.', 404));
  }

  // Check in database
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid email and password.', 404));
  }

  //   Check everything ok, send token to client
  const token = signToken(user._id);

  req.user = user;
  res.status(200).json({ success: true, id: user._id, token });
});

// Protect Route
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Get token if there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'You are not logged in. Please login to get access.'
    });
  }
  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log({ decoded });

  // Check user still exist
  const currentuser = await User.findById(decoded.id);
  if (!currentuser)
    return res.status(404).json({
      success: false,
      message: 'The user belonging to this token does no longer exist.'
    });

  // Give access
  req.user = currentuser;
  next();
});
