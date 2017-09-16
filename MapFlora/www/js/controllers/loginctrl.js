angular
  .module("starter.controllers")
  .controller("LoginCtrl", function(
    $scope,
    $state,
    $q,
    UserService,
    $ionicLoading,
    $ionicPopup,
    TokenFactory
  ) {
    var self = this;
    self.invalid = false;
    self.user = {};

    if (TokenFactory.getInfo()) {
      $state.go("app.home");
    }
    self.login = function() {
      if (self.user.email == undefined || self.user.nome == undefined) {
        $ionicPopup.alert({
          title: "Campos vázios!",
          template: "Preencha todos os campos!"
        });
      } else if (self.user.email.search("@") == -1){
        self.invalid = true;
        
      }else{
        TokenFactory.login(self.user);
        $state.go("app.home", {}, { reload: "app" });
      }
    };
  });
