angular.module('starter.map', [])
.controller('MapCtrl',['$scope','$ionicModal',function($scope, $ionicModal) {
    console.log("Teste");
    $scope.center = {lat: -7.20502001, lng: -39.44802716, zoom:15};
    $scope.markers = [];
    $scope.tiles = {url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"};
    $scope.events = {
        map: {
            enable: ['click'],
            logic: 'emit'
        },
        marker: {
            enable: ['click'],
            logic: 'emit'
        }
    };

    $scope.$on('leafletDirectiveMap.click', function(event, args) {
        console.log("map click", args.model);
    });

    $scope.markers.push({
        lat: 22.29,
        lng: 114.17,
        name: "west",
        focus: false,
        draggable: false
    })

}]);