app.controller('SignupController', function(
  $rootScope,
  $scope,
  $http,
  $location,
  AuthService
) {
  // CHECK LOGIN
  if (AuthService.checkLogin()) {
    $location.path('/dashboard');
  }

  $scope.signup = function(newUser) {
    $scope.loading = true;
    AuthService.Signup(newUser).then(
      function(response) {
        if (response.data.success === true) {
          console.log(response.data);
          $scope.loading = false;
          $scope.signupStatus = true;
        }
      },
      function(response) {
        $scope.data = response.data || 'Request failed';
        $scope.status = response.status;
        $scope.error = $scope.data.message || 'Back-End Server is offline.';
        console.log('ERROR:' + $scope.error);

        $scope.errorArray = $scope.error.split('. ');
        console.log($scope.errorArray);

        for (const err of $scope.errorArray) {
          if (err.includes('Duplicate')) {
            $scope.errorEmail = err;
          }
        }
        $scope.loading = false;
      }
    );
  };
});
