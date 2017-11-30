angular.module("starter.controllers").controller("HomeCtrl", [
  "ionicMaterialMotion",
  "ActivityFactory",
  "$timeout",
  "$scope",
  "dataService",
  "$ionicLoading",
  "getPoints",
  "$ionicPopup",
  "$cordovaStatusbar",
  function(
    ionicMaterialMotion,
    ActivityFactory,
    $timeout,
    $scope,
    dataService,
    $ionicLoading,
    getPoints,
    $ionicPopup,
    $cordovaStatusbar
  ) {
    var self = this;
    self.dados = [];
    //
    self.hasTimeline = function() {
      if (self.dados.length == 0) {
        return false;
      }
      return true;
    };
    self.dados = ActivityFactory.get();
  }
]);
