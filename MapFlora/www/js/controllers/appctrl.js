angular
  .module("starter.controllers")
.controller("AppCtrl", function(
    $ionicLoading,
    TokenFactory,
    ActivityFactory,
    $state,
    $ionicPopup,
    $ionicPlatform,
    $cordovaBarcodeScanner,
    $scope,
    $ionicModal,
    $timeout,
    getPoints,
    dataService
  ) {
    // var online = navigator.onLine;
    // if (online) {
    getPoints.get().then(function(res) {
      console.log(res);
      dataService.clear();
      dataService.addBd(res.data);
    });

    var info = TokenFactory.getInfo();
    if (info) {
      $scope.nome = info.nome;
    }

    console.log($scope.nome);
    // if (!TokenFactory.getToken()) {
    //   $state.go("login");
    // } else {
    //   TokenFactory.getUserData(TokenFactory.getInfo().email).then(function(
    //     res
    //   ) {
    //     $scope.nome = res.data.nome;
    //     ActivityFactory.upload();
    //     $timeout(function() {
    //       ActivityFactory.download(TokenFactory.getInfo().id);
    //     }, 5000);
    //   });
    // }

    $scope.logOut = function() {
      $ionicLoading.show({
        template:
          '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });
      TokenFactory.logout();

      $timeout(function() {
        $ionicLoading.hide();
        $state.go("login", {}, { reload: "app" }, { reload: "app.login" });
      }, 5000);
    };

    $scope.scan = function() {
      //Chamada ao leitor e função de callback com dados
      $cordovaBarcodeScanner.scan().then(
        function(data) {
          if (data.text) {
            $state.go("app.dados", { id: data.text });
          } else {
            $state.go("app.search");
          }
        },
        function(error) {
          $state.go("app.search");
        }
      );
    };
  })
  