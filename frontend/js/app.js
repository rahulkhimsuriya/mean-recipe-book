var app = angular.module('recipeBook', ['ngRoute', 'ui.router']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  // default route
  $urlRouterProvider.otherwise('/');
  $locationProvider.hashPrefix('');

  // app routes
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/public/home.html'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'templates/public/login.html',
      controller: 'LoginController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'templates/public/signup.html',
      controller: 'SignupController'
    })
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'templates/private/dashboard.html',
      controller: 'RecipeAllController'
    })
    .state('RecipeDetails', {
      url: '/recipe-details/:id',
      templateUrl: 'templates/private/recipe-details.html',
      controller: 'RecipeDetailsController'
    })
    .state('RecipeEdit', {
      url: '/recipe-edit/:id',
      templateUrl: 'templates/private/recipe-edit.html',
      controller: 'RecipeEditController'
    })
    .state('RecipeAdd', {
      url: '/add-recipe',
      templateUrl: 'templates/private/recipe-add.html',
      controller: 'RecipeAddController'
    })
    .state('MyRecipes', {
      url: '/my-recipes',
      templateUrl: 'templates/private/my-recipes.html',
      controller: 'MyRecipeController'
    })
    .state('profile', {
      url: '/edit-profile',
      templateUrl: 'templates/private/profile.html',
      controller: 'ProfileController'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'templates/public/login.html',
      controller: 'LogoutController'
    });
});

app.controller('LogoutController', function($rootScope, $window, $location) {
  $rootScope.isLogedIn = false;
  $rootScope.token = undefined;
  $window.localStorage.removeItem('token');
  $window.localStorage.removeItem('id');
  $rootScope.logout = true;
  $location.path('/login');
  // $location.reload();
});

app.run(run);

function run($rootScope, $http, $location, $window, AuthService, UserService) {
  var token = $window.localStorage.getItem('token');
  // keep user logged in after page refresh
  if (token) {
    // $http.defaults.headers.common.Authorization = 'Bearer ' + token;
    $rootScope.isLogedIn = true;

    // Set name at navbar
    UserService.getUser().then(
      function(res) {
        // console.log(res.data);
        $rootScope.currentUser = res.data.data;
      },
      function(err) {
        console.log(err);
        $rootScope.err = err.data.data.message;
        AuthService.Logout();
      }
    );
  }

  // redirect to login page if not logged in and trying to access a restricted page
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    var publicPages = ['/', '/login', '/signup'];
    var restrictedPage = publicPages.indexOf($location.path()) === -1;
    if (restrictedPage && !token) {
      $rootScope.isLogedIn = false;
      $location.path('/');
    }
  });
}
