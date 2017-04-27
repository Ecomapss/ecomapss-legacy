angular.module('starter.directives', [])
  .directive('map', function () {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {

      var styledMapType = new google.maps.StyledMapType(
        [
          { elementType: 'geometry', stylers: [{ color: '#e6ffe6' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#c9b2a6' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e6ffe6' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ae9e90' }]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#93817c' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{ color: '#a5b076' }]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#447530' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#336600' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#fdfcf8' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#f8c967' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#e9bc62' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{ color: '#e98d58' }]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#db8555' }]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#806b63' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#8f7d77' }]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#ebe3cd' }]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{ color: '#dfd2ae' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{ color: '#b9d3c2' }]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#92998d' }]
          }
        ],
        { name: 'IFCE Style Map' });


      function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-7.205472100000001, -39.4481227),
          zoom: 16,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: true,
          fullscreenControl: false,
          mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              'styled_map']
          }
        };

        var map = new google.maps.Map($element[0], mapOptions);

        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');

        $scope.onCreate({ map: map });



        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
    }
  }
});
