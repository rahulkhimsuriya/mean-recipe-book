app.controller('LoginController', function(
  $rootScope,
  $scope,
  $http,
  $window,
  $location,
  AuthService,
  UserService
) {
  // CHECK LOGIN
  if (AuthService.checkLogin()) {
    $location.path('/dashboard');
  }

  $scope.login = function(user) {
    $scope.loading = true;
    $scope.isLogedIn = false;
    AuthService.Login(user).then(
      function(response) {
        if (response.data.success === true) {
          console.log(response);

          var token = response.data.token;
          var userId = response.data.id;

          // STORE TOKEN IN LOCALSTORAGE
          $window.localStorage.setItem('token', token);
          // STORE USERID IN LOCALSTORAGE
          $window.localStorage.setItem('id', userId);

          // STORE TOKEN AND ID IN $rootScope
          $rootScope.token = token;

          // Reset variables
          $scope.loading = false;
          $scope.error = undefined;
          $scope.isLogedIn = true;

          // Redirect
          $location.path('/dashboard');
          location.reload();
        }
      },
      function(err) {
        console.log(err);
        $scope.isLogedIn = false;
        $rootScope.logout = false;
        $scope.error = err.data.message;
        $scope.loading = false;
      }
    );
  };
});
