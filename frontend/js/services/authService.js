app.factory('AuthService', function($rootScope, $http, $location, $window) {
  // RECIPE API URL
  var url = 'http://localhost:3000/api/v1';

  function checkLogin() {
    return $rootScope.isLogedIn &&
      $window.localStorage.getItem('token') &&
      $window.localStorage.getItem('id')
      ? true
      : false;
  }

  function Login(user) {
    return $http.post(url + '/users/login', user);
  }

  function Signup(newUser) {
    return $http.post(url + '/users/signup', newUser);
  }

  function Logout() {
    // $rootScope.error = err.data.message;
    $rootScope.isLogedIn = undefined;
    $rootScope.token = undefined;
    $window.localStorage.removeItem('token');
    $window.localStorage.removeItem('id');
    $rootScope.logout = true;
    $location.path('/login');
  }

  return {
    checkLogin: checkLogin,
    Login: Login,
    Signup: Signup,
    Logout: Logout
  };
});
