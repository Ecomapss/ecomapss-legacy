angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($state, $ionicPopup, $ionicPlatform, $cordovaBarcodeScanner, $scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.scan = function () {
      console.log("Teste");
      $cordovaBarcodeScanner
        .scan()
        .then(function (data) {
          if (data.text) {
            $state.go('app.dados', { id: data.text });
          } else {
            $state.go('app.search');
          }

        }, function (error) {
          $state.go('app.search');
        });
    }
  })

  .controller('HomeCtrl', ['ionicMaterialMotion', '$timeout', function (ionicMaterialMotion, $timeout) {

  }])

  .controller('SearchCtrl', ['$state', '$ionicLoading', '$scope', '$stateParams', 'getPoints', '$timeout', 'ionicMaterialMotion', 'dataService', function ($state, $ionicLoading, $scope, $stateParams, getPoints, $timeout, ionicMaterialMotion, dataService) {
    var self = this;
    self.se = false;
    self.dados = [];

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: false,
      maxWidth: 200,
      showDelay: 0
    });

    dataService.list().then(function (data) {
      console.log(data);
      if (data.length) {
        self.dados = data[0];
        console.log(self.dados);
        $ionicLoading.hide();
      } else {
        getPoints.get().then(function (res) {
          self.dados = res.data;
          console.log(res.data);
          dataService.put(res.data);
          $ionicLoading.hide();
        });
      }
    })

    self.viewData = function (id) {
      $state.go('app.dados', { id: id });
    }
  }])
  .controller('LoginCtrl', function () {

  })
  .controller('TabCtrl', function () {

  })
  .controller('MapCtrl', ['getPoints', '$scope', '$ionicLoading', '$cordovaGeolocation', function (getPoints, $scope, $ionicLoading, $cordovaGeolocation) {

    function marks() {
      getPoints.get().then(function (res) {
        var forest = res.data;
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        mark = [];
        popup = [];
        for (var i = 0; i < forest.length; i++) {
          // console.log(forest[i]);
          lat = forest[i].lat;
          long = forest[i].long;
          info = forest[i].nome_pop;
          var image = 'img/tree.png';
          ma = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            shape: shape,
            title: info,
            icon: image,
            position: new google.maps.LatLng(lat, long),
            info: info
          });
          var conteudo = forest[i].info;

          atach(conteudo, ma);
        }


        function atach(msg, mark) {
          var infoWindow = new google.maps.InfoWindow({
            content: msg,
            maxWidth: 500
          });

          mark.addListener('click', function () {
            infoWindow.open(mark.get('map'), mark);
          });
        }
      }, function (err) {
        console.log(err);
      })
    }
    marks();


    $scope.mapCreated = function (map) {
      $scope.map = map;
    };

    $scope.centerOnMe = function () {
      console.log("Centering");
      if (!$scope.map) {
        console.log('Não existe')

        return;
      }

      $scope.loading = $ionicLoading.show({
        content: 'Localizando',
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log("Centering");
        console.log('Got pos', pos);
        $scope.loading.hide();
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      }, function (error) {
        $scope.loading.hide();
        alert('Erro ao procurar localização: ' + error.message);
      }, { timeout: 10000 });
    };

    var marker;

    var watchOptions = {
      timeout: 15000,
      enableHightAccuracy: false
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then(null,
      function (err) {
        alert("Error: " + err.message);
      },
      function (position) {
        console.log(position);
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        $scope.map.setCenter(new google.maps.LatLng(lat, lng));

        google.maps.event.addListener($scope.map, 'idle', function () {
          if (marker) {
            marker.setMap(null);
          }
          marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(lat, lng)
          });
        });
      }
    )

    $scope.addMrk = function (position) {
      var markerTree;
      var posOptions = { timeout: 15000, enableHighAccuracy: true };
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          var lat = position.coords.latitude
          var lng = position.coords.longitude

          var image = 'img/tree.png',
            markerTree = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              icon: image,
              position: new google.maps.LatLng(lat, lng)
            });
        }, function (err) {
          // error
        });
    }
  }])

  .controller('DadosCtrl', ['$scope', '$stateParams', 'dataService', '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', function ($scope, $stateParams, dataService, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    var self = this;
    self.id = $stateParams.id;
    self.dados = {};
    dataService.getById(self.id).then(function (data) {
      self.dados = data;
      console.log(self.dados);
      $scope.apply;
    })

    $timeout(function () {
      ionicMaterialMotion.slideUp({
        selector: '.slide-up'
      });
    }, 300);

    ionicMaterialInk.displayEffect();

  }])