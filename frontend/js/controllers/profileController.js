app.controller('ProfileController', function(
  AuthService,
  UserService,
  $rootScope,
  $scope
) {
  // Check Login
  if (!AuthService.checkLogin()) {
    $rootScope.error = 'Token/Id is not avalible.';
    AuthService.Logout();
  }

  $scope.profileUpdate = false;
  $scope.user = {};

  UserService.getUser().then(
    function(res) {
      $scope.user = res.data.data;
      $rootScope.currentUser = res.data.data;
    },
    function(err) {
      console.log(err);
      $scope.err.data.data.message;
      AuthService.Logout();
    }
  );

  $scope.updateProfile = function(user) {
    $scope.loading = true;
    console.log('TOKEN: ' + localStorage.getItem('token'));
    console.log('ID: ' + localStorage.getItem('id'));

    console.log(user);
    UserService.updateProfile(user).then(
      function(res) {
        console.log(res.data);

        $scope.loading = false;
        $scope.errorProfileUpdate = undefined;
        $scope.isProfileUpdated = true;
      },
      function(err) {
        console.log(err);
        $scope.isProfileUpdated = false;
        $scope.errorProfileUpdate = err.data.message;
        $scope.loading = false;
      }
    );
  };

  $scope.updatePassword = function(data) {
    $scope.loadingChangePassword = true;
    console.log(data);
    UserService.updatePassword(data).then(
      function(res) {
        $scope.errorPasswordUpdate = undefined;
        $scope.isPasswordUpdated = true;
        $scope.loadingChangePassword = false;
      },
      function(err) {
        // console.log(err);
        $scope.isPasswordUpdated = false;
        $scope.errorPasswordUpdate = err.data.message;
        $scope.loadingChangePassword = false;
      }
    );
  };
});
