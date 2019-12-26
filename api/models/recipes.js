const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // trim:true,
      required: [true, "Please provide us your recipe's title."]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, "Please provide us user's ID."]
    },
    description: {
      type: String,
      required: [true, 'Please provide a description about your recipe.']
    },
    imageUrl: {
      type: String,
      default: ''
    },
    course: {
      type: String,
      required: [true, 'Please provide a recipe course.'],
      enum: {
        values: ['Breackfast', 'Dessert', 'Drink', 'Maindish', 'Salad', 'Soup'],
        message: 'Recipe course type can not be other than provided.'
      }
    },
    ingredients: {
      type: String,
      required: [true, 'please provide us ingredients.']
    },
    instructions: {
      type: String,
      required: [true, 'Please provide an instruction.']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: Date
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//Export the model
module.exports = mongoose.model('Recipe', recipeSchema);
