angular
  .module("starter.controllers")
  .controller("LoginCtrl", function(
    $scope,
    $state,
    $q,
    UserService,
    $ionicLoading,
    $ionicPopup,
    TokenFactory,
    $ionicModal
  ) {
    var self = this;
    self.invalid = false;
    self.user = {};

    if (TokenFactory.getInfo()) {
      $state.go("app.home");
    }

    $ionicModal
      .fromTemplateUrl("templates/avatarchoose.html", {
        scope: $scope
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    self.login = function() {
      if (self.user.nome == undefined) {
        $ionicPopup.alert({
          title: "Campos vázios!",
          template: "Preencha todos os campos!"
        });
      } else {
        TokenFactory.login(self.user);
        $state.go("loginavatar", {}, { reload: "app" });
      }
    };
  });
