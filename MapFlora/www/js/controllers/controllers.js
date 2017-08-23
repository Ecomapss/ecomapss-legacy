angular
  .module("starter.controllers", [])
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
    // } else {
    //   $ionicPopup.alert({
    //     title: "Error!",
    //     template:
    //       "Você não está conectado há uma rede, portanto os dados ficarão desatualizados"
    //   });
    // }
    
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
  .controller("HomeCtrl", [
    "ionicMaterialMotion",
    "ActivityFactory",
    "$timeout",
    "$scope",
    "dataService",
    "$ionicLoading",
    "getPoints",
    "$ionicPopup",
    function(
      ionicMaterialMotion,
      ActivityFactory,
      $timeout,
      $scope,
      dataService,
      $ionicLoading,
      getPoints,
      $ionicPopup
    ) {
      var self = this;
      self.dados = [];


    self.hasTimeline = function () {
      if (self.dados.length == 0) {
        return false;
      }
      return true;
    }
    self.dados = ActivityFactory.get();
    }
  ])
  .controller("SearchCtrl", [
    "$state",
    "$ionicLoading",
    "$scope",
    "$stateParams",
    "getPoints",
    "$timeout",
    "ionicMaterialMotion",
    "dataService",
    function(
      $state,
      $ionicLoading,
      $scope,
      $stateParams,
      getPoints,
      $timeout,
      ionicMaterialMotion,
      dataService
    ) {
      var self = this;
      self.se = false;
      self.dados = [];

      //Loading enquanto busca dados no serviço
      $ionicLoading.show({
        template:
          '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });
      //Pegando dados no serviço
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

      //Função para mudar view para dados
      self.viewData = function(id) {
        $state.go("app.dados", { id: id });
      };
    }
  ])
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

    if (TokenFactory.getInfo()) {
      $state.go("app.home");
    }

    self.login = function(user) {
    //   $ionicLoading.show({
    //     template:
    //       '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
    //   });

      TokenFactory.login(user);
      $state.go("app.home", {}, { reload: "app" });
    };
  })
  .controller("TabCtrl", function() {})
  .controller("MapCtrl", [
    "getPoints",
    "$scope",
    "$ionicLoading",
    "$cordovaGeolocation",
    function(getPoints, $scope, $ionicLoading, $cordovaGeolocation) {
      //Função para marcar no mapa
      function marks() {
        //Captura os pontos em um serviço
        getPoints.get().then(
          function(res) {
            //recebe os dados das arvores
            var forest = res.data;
            mark = [];
            popup = [];
            //Realiza um laço para distribuir os pontos no mapa
            for (var i = 0; i < forest.length; i++) {
              if (forest[i].loc.length > 1) {
                console.log(forest[i].loc);
                for (var j = 0; j < forest[i].loc.length; j++) {
                  lat = Number.parseFloat(forest[i].loc[j].lat);
                  long = Number.parseFloat(forest[i].loc[j].lng);

                  info = forest[i].nome_pop;
                  var image = "img/tree.png";
                  ma = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    title: info,
                    icon: image,
                    position: new google.maps.LatLng(lat, long),
                    info: info
                  });
                  var conteudo = forest[i];
                  atach(conteudo, ma);
                }
              }
            }

            //Função para fixar uma infowindow ao seu respectivo ponto
            function atach(msg, mark) {
              var infoWindow = new google.maps.InfoWindow({
                content:
                  "<div>" +
                  '<div class="iw-head"><b>' +
                  msg.nome_cie +
                  "</b></div>" +
                  '<div class="iw-content">' +
                  '<div class="iw-pop">' +
                  msg.nome_pop +
                  "</div>" +
                  '<img src="img/trees/' +
                  msg._id.$oid +
                  '.jpg" height="140" width="240">' +
                  "<p> <b>Clima: </b>" +
                  msg.clima +
                  "<br> <b>Origem:</b> " +
                  msg.origem +
                  "<br>" +
                  "</div>" +
                  '<a ng-click="function (){console.log("teste")}" class="iw-subTitle">Mais Dados</a>' +
                  '<div class="iw-bottom-gradient"></div>' +
                  "</div>",
                maxWidth: 500
              });

              //Add um listener ao mark para quando clicado abrir a info window
              mark.addListener("click", function() {
                infoWindow.open(mark.get("map"), mark);
              });
            }
          },
          function(err) {
            console.log(err);
          }
        );
      }

      //Inicia a marcação
      marks();

      //Mudar view
      $scope.go = function(id) {
        $state.go("app.dados", { id: id });
      };

      //Criando o map
      $scope.mapCreated = function(map) {
        $scope.map = map;
      };

      //Função para centralizar no usuario
      $scope.centerOnMe = function() {
        console.log("Centering");
        if (!$scope.map) {
          console.log("Não existe");
          return;
        }
        $ionicLoading.show({
          content: "Localizando",
          showBackdrop: true
        });
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            console.log("Centering");
            console.log("Got pos", pos);
            $ionicLoading.hide();
            $scope.map.setCenter(
              new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
            );
          },
          function(error) {
            $ionicLoading.hide();
            alert("Erro ao procurar localização: " + error.message);
          },
          { timeout: 10000 }
        );
      };
    }
  ])
  .controller("DadosCtrl", [
    "$scope",
    "$timeout",
    "TokenFactory",
    "ActivityFactory",
    "$http",
    "$stateParams",
    "dataService",
    "$timeout",
    "ionicMaterialMotion",
    "ionicMaterialInk",
    function(
      $scope,
      $timeout,
      TokenFactory,
      ActivityFactory,
      $http,
      $stateParams,
      dataService,
      $timeout,
      ionicMaterialMotion,
      ionicMaterialInk
    ) {
      var self = this;
      //Recebe o id via url
      self.id = $stateParams.id;
      self.dados = {};

      function dataAtualFormatada() {
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length == 1) dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length == 1) mes = "0" + mes;
        var ano = data.getFullYear();
        return dia + "/" + mes + "/" + ano;
      }

      //Busca no serviço pelo id da arvore
      dataService.getById(self.id).then(function(data) {
        oneACt = {
          idUser: TokenFactory.getInfo().id,
          email: TokenFactory.getInfo().email,
          act:
            "Visualizou uma " + data.nome_cie + " em " + dataAtualFormatada(),
          date: new Date(),
          uploaded: false
        };

        $http.get("img/trees/" + self.id + ".jpg").then(
          function() {
            self.source = "img/trees/" + self.id + ".jpg";
            self.dados = data;
            $scope.apply;
          },
          function() {
            self.source = "img/stan.jpg";
            self.dados = data;
            $scope.apply;
          }
        );
        $timeout(function() {
          ActivityFactory.add(oneACt);
          ActivityFactory.upload();
        }, 5000);
      });

      //Timeout para realizar animações
      $timeout(function() {
        ionicMaterialMotion.slideUp({
          selector: ".slide-up"
        });
      }, 300);

      //ativação de animações
      ionicMaterialInk.displayEffect();
    }
  ]);
