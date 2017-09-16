angular
  .module("starter.controllers")
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