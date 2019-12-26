app.factory('UserService', function($rootScope, $http, $window) {
  var url = 'http://localhost:3000/api/v1/users';
  var token = localStorage.getItem('token');
  var userId = localStorage.getItem('id');

  config = {
    headers: {
      Authorization: 'Bearer ' + token
    }
  };

  function getUser() {
    return $http.get(url + '/' + userId, config);
  }

  function updateProfile(user) {
    return $http.patch(url + '/updateMe', JSON.stringify(user), config);
  }

  function updatePassword(newPassword) {
    return $http.patch(
      url + '/updateMyPassword',
      JSON.stringify(newPassword),
      config
    );
  }

  return {
    getUser: getUser,
    updateProfile: updateProfile,
    updatePassword: updatePassword
  };
});
