const Recipe = require('./../models/recipes');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// GET ALL RECIPE
exports.getAllRecipe = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find()
    .select('title description course imageUrl')
    .populate('user', 'firstname lastname');
  res
    .status(200)
    .json({ success: true, results: recipes.length, data: recipes });
});

// GET SINGLE RECIPE
exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate('user');
  if (!recipe) return next(new AppError(`Recipe not found with that ID`, 404));
  res.status(200).json({ success: true, data: recipe });
});

// CHECK RECIPE BELONGS TO CURRENT USER OR NOT
exports.checkMyRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.find({ _id: req.params.id, user: req.user._id });

  // console.log(`RECIPE: ${recipe}`);

  if (!recipe || recipe.length <= 0) {
    return next(new AppError(`You does not have recipe with that ID`, 404));
  } else {
    next();
  }
});

// CREATE NEW RECIPE
exports.createRecipe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  let filepath = req.file;  

  if (filepath == '' || filepath == undefined || filepath == null) {
    filepath = 'public/recipe-imgs/default.jpg';
  } else {
    filepath = req.file.path.split('\\').join('/');
  }
  // console.log('PATH: ' + filepath);
 // console.log(req.body);

  const newRecipe = await Recipe.create({
    title: req.body.title,
    user: req.user._id,
    description: req.body.description,
    imageUrl: filepath,
    course: req.body.course,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions
  });
  res.status(201).json({ success: true, data: newRecipe });
});

// GET ALL CURRENT USER's RECIPE
exports.getAllMyRecipes = catchAsync(async (req, res, next) => {
  const myRecipes = await Recipe.find({ user: req.user._id }).select(
    'title description course imageUrl createdAt'
  );
  res
    .status(200)
    .json({ success: true, results: myRecipes.length, data: myRecipes });
});

exports.updateMyRecipe = catchAsync(async (req, res, next) => {
  // console.log(req.file);

  let filepath = req.file;
  // console.log(req.file);

  if (filepath == '' || filepath == undefined || filepath == null) {
    filepath = 'public/recipe-imgs/default.jpg';
  } else {
    filepath = req.file.path.split('\\').join('/');
  }
  // console.log('PATH: ' + filepath);

  // Update Date 
  const updatedAt = Date.now();

  const { title, description, course, ingredients, instructions } = req.body;
  console.log(req.body);

  const updateRecipe = await Recipe.findByIdAndUpdate(
    req.params.id,
    {
      $set: { title, description, course, ingredients, instructions, updatedAt, imageUrl:filepath  }
    },
    { new: true, runValidators: true }
  );
  if (!updateRecipe) {
    return next(new AppError(`Recipe not found and not updated.`, 404));
  }
  res.json({ status: true, data: updateRecipe });
});

// DELETE RECIPE
exports.deleteMyRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findByIdAndDelete(req.params.id);
  if (!recipe) return next(new AppError('Recipe not found with that ID', 404));
  res.status(204).json({ success: true, data: null });
});
