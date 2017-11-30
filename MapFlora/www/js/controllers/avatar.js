angular
  .module("starter.controllers")
  .controller("AvatCtrl", function($scope, $state, TokenFactory) {
    $scope.setAvatar = function(url) {
      TokenFactory.setavatar(url);
      $state.go("app.search", {}, { reload: "app" });
    };
  });
