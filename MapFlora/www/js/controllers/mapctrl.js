angular.module("starter.controllers").controller("MapCtrl", [
  "getPoints",
  "$scope",
  "$ionicLoading",
  "$cordovaGeolocation",
  "dataService",
  "$state",
  function(
    getPoints,
    $scope,
    $ionicLoading,
    $cordovaGeolocation,
    dataService,
    $state
    ) {
    var Land;
    var locationsTree = dataService.getLocation()[0];
    var markers = new Array();

    //Criando o map
    $scope.mapCreated = function(map, L) {
      $scope.map = map;
      Land = L;
    };

    function removeMarks() {
      for (var i = 0; i < markers.length; i++) {
        if (markers[i] != -1) $scope.map.removeLayer(markers[i]);
      }
    }

    function load() {
      $ionicLoading.hide();
      for (var i = 0; i < locationsTree.length; i++) {
        if (locationsTree[i].lat && locationsTree[i].lng) {
          // if (window.cordova) {
          //   var posOptions = {timeout: 10000, enableHighAccuracy: true};
          //   $cordovaGeolocation
          //   .getCurrentPosition(posOptions)
          //   .then(function (position) {
          //     var lat  = position.coords.latitude
          //     var long = position.coords.longitude
          //     a = calc(lat, long,
          //       locationsTree[i].lat,
          //       locationsTree[i].lng
          //       );
          //     alert(a);
          //     if (a < 100.00) {
           
          //     }else {
          //       alert("Não existe arvores perto de vocẽ!");
          //     }
          //   }, function(err) {
          //     alert("Error ao acessar GPS, Verifique se o app tem as permissões necessarias!");
          //   });
          // }
          marker = new Land.marker([
            locationsTree[i].lat,
            locationsTree[i].lng
            ]);
          marker.bindPopup("Latitude: " + locationsTree[i].lat + "<br>" + " Longitude: " + locationsTree[i].lng).openPopup();
          markers.push(marker);
          $scope.map.addLayer(markers[i]);
        } else markers.push(-1);
      }
      $ionicLoading.hide();
    }

    $scope.$on("$ionicView.enter", function() {
      locationsTree = dataService.getLocation()[0];
      if (locationsTree) {
        // $ionicLoading.show({
        //   content: "Carregando...",
        //   showBackdrop: false
        // });

        removeMarks();
        markers = new Array();
        setTimeout(function() {
          if (Land != null && Land != undefined) load();
        }, 3000);
      }
    });

    //Mudar view
    $scope.go = function(id) {
      $state.go("app.dados", { id: id });
    };

    function degrees_to_radians(degrees) {
      var pi = Math.PI;
      return degrees * (pi / 180);
    }

    function calc(lat1, lon1, lat2, lon2) {
      var R = 6371e3; // metres
      var o1 = degrees_to_radians(lat1);
      var o2 = degrees_to_radians(lat2);
      var Ap = degrees_to_radians(lat2 - lat1);
      var Ay = degrees_to_radians(lon2 - lon1);

      var a =
      Math.sin(Ap / 2) * Math.sin(Ap / 2) +
      Math.cos(o1) * Math.cos(o2) * Math.sin(Ay / 2) * Math.sin(Ay / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      var d = R * c;

      return d;
    }

    //Função para centralizar no usuario
    $scope.centerOnMe = function() {
      console.log("Centering");

      if (!$scope.map) {
        return;
      }

      $scope.loading = $ionicLoading.show({
        content: "Getting current location...",
        showBackdrop: false
      });

      navigator.geolocation.getCurrentPosition(
        function(pos) {
          console.log("Got pos", pos);
          $scope.map.setView([pos.coords.latitude, pos.coords.longitude]);
          $ionicLoading.hide();
        },
        function(error) {
          alert("Unable to get location: " + error.message);
          $ionicLoading.hide();
        }
        );
      // console.log("Centering");
      // if (!$scope.map) {
      //   console.log("Não existe");
      //   return;
      // }
      // $ionicLoading.show({
      //   content: "Localizando",
      //   showBackdrop: true
      // });
      // navigator.geolocation.getCurrentPosition(
      //   function(pos) {
      //     console.log("Centering");
      //     console.log("Got pos", pos);
      //     $ionicLoading.hide();
      //     $scope.map.setCenter(
      //       new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
      //     );
      //   },
      //   function(error) {
      //     $ionicLoading.hide();
      //     alert("Erro ao procurar localização: " + error.message);
      //   },
      //   { timeout: 10000 }
      // );
    };
  }
  ]);
