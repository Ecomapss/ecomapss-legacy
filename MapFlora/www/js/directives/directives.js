angular
.module("starter.directives", [])
.directive("map", function($cordovaGeolocation) {
  return {
    restrict: "E",
    scope: {
      onCreate: "&"
    },
    link: function($scope, $element, $attr) {
      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
          var R = 6371; // Radius of the earth in km
          var dLat = deg2rad(lat2 - lat1); // deg2rad below
          var dLon = deg2rad(lon2 - lon1);
          var a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          var d = R * c; // Distance in km
          return d;
        }

        function deg2rad(deg) {
          return deg * (Math.PI / 180);
        }
        function initialize() {
          if (window.cordova) {
            var posOptions = { timeout: 10000, enableHighAccuracy: false };
            $cordovaGeolocation.getCurrentPosition(posOptions).then(
              function(position) {
                var lat = position.coords.latitude;
                var long = position.coords.longitude;
                var mapOptions = {
                  center: [lat, long],
                  zoom: 15,
                  zoomControl: false,
                  maxZoom: 15,
                  minZoom: 12
                };
                for (var i = 0; i < locs.length; i++) {
                  var x = getDistanceFromLatLonInKm(
                    locs[i].lat,
                    locs[i].lng,
                    lat,
                    long
                    );
                  if (x < 0.9) {
                    folder = locs[i].name;
                    mapOptions.zoom = locs[i].zoom;
                    mapOptions.minZoom = locs[i].minZoom;
                    mapOptions.maxZoom = locs[i].maxZoom;
                  }
                }
                if (!folder) {
                  folder = "IFCE";
                }
                var map = L.map($element[0], mapOptions);
                L.tileLayer(
                  "OSMPublicTransport/" + folder + "/{z}/{x}/{y}.png",
                  {
                    attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  }
                  ).addTo(map);
                $scope.onCreate({ map: map, L: L });
              },
              function(err) {
                alert("Error ao recuperar localização, verifica se a mesma está ativada ou o app tem as permissões adequadas")
              }
              );
          } else if (window.cordova == undefined || !window.cordova || window.cordova === undefined){
            function error(err) {
              console.warn('ERROR(' + err.code + '): ' + err.message);
            };
            navigator.geolocation.getCurrentPosition(function(res) {
              console.log(res);
              var mapOptions = {
                center: [res.coords.latitude, res.coords.longitude],
                zoom: 15,
                zoomControl: false,
                maxZoom: 15,
                minZoom: 12
              };
              for (var i = 0; i < locs.length; i++) {
                var x = getDistanceFromLatLonInKm(
                  locs[i].lat,
                  locs[i].lng,
                  res.coords.latitude,
                  res.coords.longitude
                  );
                if (x < 0.9) {
                  folder = locs[i].name;
                  mapOptions.zoom = locs[i].zoom;
                  mapOptions.minZoom = locs[i].minZoom;
                  mapOptions.maxZoom = locs[i].maxZoom;
                }
              }
              if (!folder) {
                folder = "IFCE";
              }
              var map = L.map($element[0], mapOptions);
              L.tileLayer("OSMPublicTransport/" + folder + "/{z}/{x}/{y}.png", {
                attribution:
                '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
              $scope.onCreate({ map: map, L: L });
            }, error);
          }
        }

        if (document.readyState === "complete") {
          initialize();
        } else {
          window.addEventListener("load", initialize);
        }

        var locs = [
        {
          name: "SITIO",
          lat: -7.23444472,
          lng: -39.43845302,
          minZoom: 13,
          maxZoom: 15,
          zoom: 15
        },
        {
          name: "IFCE",
          lat: -7.20510517,
          lng: -39.44798291,
          minZoom: 14,
          maxZoom: 17,
          zoom: 17
        },
        {
          name: "CENTRO",
          lat: -7.23280563,
          lng: -39.41237926,
          minZoom: 13,
          maxZoom: 16,
          zoom: 16
        },
        {
          name: "TAUA",
          lat: -5.39973789,
          lng: -40.07294622,
          minZoom: 13,
          maxZoom: 16,
          zoom: 16
        }
        ];
      }
    };
  });
