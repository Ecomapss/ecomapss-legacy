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
    dataService,
    $ionicModal,
    ionicMaterialMotion,
    ionicMaterialInk
  ) {
    var info;
    var urlImg;

    function load() {
      info = TokenFactory.getInfo();
      urlImg = TokenFactory.getAvatar();
    }
    load();

    dataService.list().then(function(data) {
      if (data.length) {
        self.dados = data[0];
        $ionicLoading.hide();
      } else {
        getPoints.get().then(function(res) {
          self.dados = res.data;
          dataService.put(res.data);
          $ionicLoading.hide();
        });
      }
    });

    $scope.setAvatar = function(url) {
      TokenFactory.updateAvatar(url);
      $scope.modal2.hide();
      $state.go("app.home", { reaload: "app.home" });
      load();
      $scope.avatar = urlImg;
      $scope.modal2.hide();
    };

    $scope.update = function() {
      TokenFactory.updateInfos($scope.info);
      $scope.modal.hide();
      $state.go("app.home", { reaload: "app.home" });
      $scope.info = info;
      $scope.nome = info.nome;
      $scope.avatar = urlImg;
    };

    $scope.clearFabs = function() {
      var fabs = document.getElementsByClassName("button-fab");
      if (fabs.length) {
        fabs[0].classList.remove("drop");
      }
    };

    setTimeout(function() {
      $scope.clearFabs();
    }, 1000);

    ionicMaterialInk.displayEffect();

    getPoints.get().then(function(res) {
      dataService.clear();
      dataService.addBd(res.data);
    });

    $scope.info = {};

    $ionicModal
      .fromTemplateUrl("templates/perfil.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal) {
        $scope.modal = modal;
      });

    $ionicModal
      .fromTemplateUrl("templates/avatars.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal2) {
        $scope.modal2 = modal2;
      });

    $ionicModal
      .fromTemplateUrl("templates/sobre.html", {
        scope: $scope,
        animation: "slide-in-up"
      })
      .then(function(modal3) {
        $scope.modal3 = modal3;
      });

    if (info) {
      $scope.info = info;
      $scope.nome = info.nome;
      $scope.avatar = urlImg;
    }

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
          dataService.getByIdJSON(data.text, (res)=> {
             for (var i = 0; i < res.data.length; i++) {
                if (res.data[i]._id == self.id) {
                  if (res.data[i].fossil)
                    $state.go("app.dadosfosseis", { id: data.text });
                  else if(res.data[i].inseto)
                    $state.go("app.dadosinsetos", { id: data.text });
                  else if (res.data[i].historia)
                    $state.go("app.dadoshistorias", { id: data.text });
                  else 
                    $state.go("app.dados", { id: data.text });  
                }
             }
          })
          } else {
            $state.go("app.search");
          }
        },
        function(error) {
          $state.go("app.search");
          alert("Leitura não efetuada!");
        }
      );
    };
  });
