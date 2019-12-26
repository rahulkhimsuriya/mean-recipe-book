const express = require('express');
const router = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/recipe-imgs/');
  },
  filename: function(req, file, cb) {
    cb(null, 'recipe-img-' + file.originalname);
  }
});

// const fileFilter = (req, file, cb) => {
//   if (file.minetype == 'image/jpeg' || file.minetype == 'image/png') {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

const upload = multer({ storage });

// Controllers
const authController = require('./../controllers/authController');
const recipeController = require('./../controllers/recipeController');

router.use('/', authController.protect);
router.use('/my-recipes/:id', recipeController.checkMyRecipe);

router.get('/my-recipes', recipeController.getAllMyRecipes);

router
  .route('/my-recipes/:id')
  .patch(upload.single('imageUrl'), recipeController.updateMyRecipe)
  .delete(recipeController.deleteMyRecipe);

router
  .route('/')
  .get(recipeController.getAllRecipe)
  .post(upload.single('imageUrl'), recipeController.createRecipe);

router.route('/:id').get(recipeController.getRecipe);

module.exports = router;
