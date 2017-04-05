angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HomeCtrl', ['ionicMaterialMotion',function(ionicMaterialMotion) {
  ionicMaterialMotion.fadeSlideIn();
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('LoginCtrl', function() {

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
        for (var i = 0; i < forest.length; i++) {
          console.log(forest[i]);
          lat = forest[i].lat;
          long = forest[i].long;
          info = forest[i].nome_pop;
          var image = 'img/tree.png',
            marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              shape: shape,
              title: info,
              icon: image,
              position: new google.maps.LatLng(lat, long),
              info: info
            });
        }
        google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
        })
        var conteudo = marker.info;

        var infoWindow = new google.maps.InfoWindow({
          content: conteudo,
          maxWidth: 500
        })
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
        console.log('Got pos', pos);
        $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        $scope.loading.hide();
      }, function (error) {
        alert('Erro ao procurar localização: ' + error.message);
      });
    };

    var marker;

    var watchOptions = {
      timeout: 3000,
      enableHightAccuracy: false
    };

    var watch = $cordovaGeolocation.watchPosition(watchOptions);

    watch.then(null,
      function (err) {
        alert("Error: " + err.message);
      },
      function (position) {

        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
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
      var posOptions = { timeout: 2000, enableHighAccuracy: true };
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
  }]);