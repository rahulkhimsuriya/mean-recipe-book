app.factory('RecipeService', function($http, $window) {
  var url = 'http://localhost:3000/api/v1/recipes';
  var token = $window.localStorage.getItem('token');
  config = {
    // transformRequest: angular.indentity,
    headers: { Authorization: 'Bearer ' + token }
  };
  configMultiForm = {
    transformRequest: angular.indentity,
    headers: {
      'Content-Type': undefined,
      Authorization: 'Bearer ' + token
    }
  };

  function getAllRecipe() {
    return $http.get(url, config);
  }
  function getSingleRecipe(id) {
    return $http.get(url + '/' + id, config);
  }
  function getMyRecipes() {
    return $http.get(url + '/my-recipes', config);
  }
  function deleteMyRecipe(id) {
    console.log(id);
    return $http.delete(url + '/my-recipes/' + id, config);
  }
  function createRecipe(newRecipe) {
    return $http.post(url, newRecipe, configMultiForm);
  }
  function updateRecipe(id, recipe) {
    return $http.patch(url + '/my-recipes/' + id, recipe, configMultiForm);
  }
  return {
    getAllRecipe: getAllRecipe,
    getSingleRecipe: getSingleRecipe,
    getMyRecipes: getMyRecipes,
    deleteMyRecipe: deleteMyRecipe,
    createRecipe: createRecipe,
    updateRecipe: updateRecipe
  };
});
