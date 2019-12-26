// Error Hander
function errorHandler(err) {
  console.log(err);
  // AuthService.logout();
  $scope.error = err.data;
}

app.controller('RecipeAllController', function(
  RecipeService,
  AuthService,
  $rootScope,
  $scope
) {
  console.log($rootScope);

  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  initController();

  function initController() {}

  // Get All Recipes
  $scope.recipes = '';
  RecipeService.getAllRecipe().then(
    function(res) {
      $scope.recipes = res.data.data;
      console.log(res.data.data);
    },
    function(err) {
      console.log(err);
      // AuthService.logout();
      $scope.error = err.data;
    }
  );
});

// Get Single Recipe
app.controller('RecipeDetailsController', function(
  RecipeService,
  AuthService,
  UserService,
  $rootScope,
  $scope,
  $stateParams,
  $location
) {
  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  setTimeout(function() {
    $rootScope.isRecipeEdited = false;
    $rootScope.isRecipeEdited = undefined;
  }, 3000);

  $scope.recipe = '';
  RecipeService.getSingleRecipe($stateParams.id).then(
    function(res) {
      // console.log(res);
      $scope.recipe = res.data.data;
      $scope.recipe.ingredients = $scope.recipe.ingredients.split(',');
    },
    function(err) {
      console.log(err);
      // AuthService.logout();
      $scope.error = err.data.message;
    }
  );

  // Get Current User's Info
  UserService.getUser().then(
    function(res) {
      // console.log(res);
      $scope.userId = res.data.data._id;
    },
    function(err) {
      console.log(err);
      AuthService.logout();
      $scope.error = err.data;
    }
  );

  // Delete Recipe
  $scope.deleteRecipe = function() {
    console.log('DELETE:' + $stateParams.id);
    RecipeService.deleteMyRecipe($stateParams.id).then(
      function(res) {
        console.log(res);
        $rootScope.deleteRecipe = true;
        $location.path('/dashboard');
      },
      function(err) {
        console.log(err);
        // AuthService.logout();
        $scope.error = err.data;
      }
    );
  };
});

// Create New Recipe
app.controller('RecipeAddController', function(
  RecipeService,
  AuthService,
  $rootScope,
  $scope,
  $location
) {
  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  $scope.newRecipe = {};
  $scope.newRecipe.ingredients = [];

  $scope.makeingredientsList = function(newingredients) {
    if (newingredients === null || newingredients === undefined) {
      return ($scope.erroringredients = true);
    }

    // console.log(ingredients);
    $scope.newRecipe.ingredients.push(newingredients);
    $scope.newingredients = null;
    $scope.erroringredients = false;
  };

  $scope.removeFromList = function(index) {
    console.log(index);
    $scope.newRecipe.ingredients.splice(index, 1);
  };

  var errors = [];

  $scope.createRecipe = function(newRecipe) {
    // console.log(newRecipe);
    $scope.loadingCreateRecipe = true;

    // DATA
    let fd = new FormData();
    fd.ingredients = [];
    for (var key in newRecipe) {
      fd.append(key, newRecipe[key]);
      console.log(key + ':' + newRecipe[key]);
    }

    // // FILE
    var file = $('#imageUrl')[0].files[0];
    fd.append('imageUrl', file);
    console.log(file);
    // console.log(fd);
    console.log(newRecipe);

    // Make Request
    RecipeService.createRecipe(fd).then(
      function(res) {
        console.log(res);
        $rootScope.recipeCreated = true;
        $scope.loadingCreateRecipe = false;
        $location.path('/my-recipes');
      },
      function(err) {
        errors = err.data.message.split('. ');
        // errors.shift();
        errors = errors.filter(function(err) {
          return err != 'Invalide input data';
        });
        console.log(errors);

        $scope.errorsRecipeCreate = errors;
        $rootScope.recipeCreated = undefined;
        console.log(err.data);
        $scope.loadingCreateRecipe = false;
      }
    );
  };
});

// Get All My Recipes
app.controller('MyRecipeController', function(
  RecipeService,
  UserService,
  AuthService,
  $rootScope,
  $scope,
  $window,
  $stateParams
) {
  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  // Recipe creatd msg make undefined
  setTimeout(function() {
    $rootScope.recipeCreated = undefined;
  }, 3000);

  // console.log(UserService.getUser());

  $scope.myRecipes = '';
  RecipeService.getMyRecipes().then(
    function(res) {
      // console.log(res.data.data);
      $scope.myRecipes = res.data.data;
    },
    function(err) {
      console.log(err);
      // AuthService.logout();
      $scope.error = err.data;
    }
  );
});

// Update My Recipe
app.controller('RecipeEditController', function(
  RecipeService,
  AuthService,
  UserService,
  $rootScope,
  $scope,
  $stateParams,
  $location
) {
  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  $scope.makeingredientsList = function(newingredients) {
    if (newingredients === null || newingredients === undefined) {
      return ($scope.erroringredients = true);
    }

    // console.log(ingredients);
    $scope.recipe.ingredients.push(newingredients);
    $scope.newingredients = null;
    $scope.erroringredients = false;
  };

  $scope.removeFromList = function(index) {
    console.log(index);
    $scope.recipe.ingredients.splice(index, 1);
  };

  $scope.recipe = {};
  RecipeService.getSingleRecipe($stateParams.id).then(
    function(res) {
      // console.log(res);
      $scope.recipe = res.data.data;
      $scope.recipe.ingredients = $scope.recipe.ingredients.split(',');
      console.log(res.data.data);
    },
    function(err) {
      console.log(err);
      // AuthService.logout();
      $scope.error = err.data.message;
    }
  );

  var errors = [];

  $scope.updateRecipe = function(recipe) {
    console.log(recipe);
    $scope.loadingEditRecipe = true;

    // DATA
    let fd = new FormData();
    fd.ingredients = [];
    for (var key in recipe) {
      fd.append(key, recipe[key]);
      // console.log($scope.recipe[key]);
    }

    // FILE
    var file = $('#imageUrl')[0].files[0];
    fd.append('imageUrl', file);
    console.log(file);
    // console.log(fd);
    console.log(recipe);

    // Make Request
    RecipeService.updateRecipe(recipe._id, fd).then(
      function(res) {
        console.log(res);
        $rootScope.isRecipeEdited = true;
        $scope.loadingEditRecipe = false;
        $location.path('/recipe-details/' + recipe._id);
      },
      function(err) {
        errors = err.data.message.split('. ');
        errors = errors.filter(function(err) {
          return err != 'Invalide input data';
        });
        // errors.shift();
        console.log(errors);

        $scope.errorsRecipeEdit = errors;
        $rootScope.recipeEdit = undefined;
        console.log(err.data);
        $scope.loadingEditRecipe = false;
      }
    );
  };
});
