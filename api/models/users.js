const mongoose = require('mongoose'); // Erase if already required
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Please provide us your firstname.']
    },
    lastname: {
      type: String,
      required: [true, 'Please provide us your lastname.']
    },
    email: {
      type: String,
      required: [true, 'Please provide us your email.'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide us valid email.']
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Please provide a password.'],
      minlength: [6, 'Password must be equeal or more than 6 character.']
    },
    registeredAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ENCRYPT PASSWORD
userSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = (candidatePassword, userPassword) => {
  return bcrypt.compare(candidatePassword, userPassword);
};

// VIRTUAL POPULATE
userSchema.virtual('recipes').get(function() {});

//Export the model
module.exports = mongoose.model('User', userSchema);
