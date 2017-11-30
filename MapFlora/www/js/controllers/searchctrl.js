angular.module("starter.controllers").controller("SearchCtrl", [
  "$state",
  "$ionicLoading",
  "$scope",
  "$stateParams",
  "getPoints",
  "$timeout",
  "ionicMaterialMotion",
  "ionicMaterialInk",
  "dataService",
  function(
    $state,
    $ionicLoading,
    $scope,
    $stateParams,
    getPoints,
    $timeout,
    ionicMaterialMotion,
    ionicMaterialInk,
    dataService
    ) {
    var self = this;
    self.se = false;
    self.dados = [];
    self.items = new Array();
    var count = new Number();
    var mid = 0;
    var i = 0;
    ionicMaterialInk.displayEffect();

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
    setTimeout(function () {
      ionicMaterialMotion.blinds();
    },1000);


    // function filter()

    // $scope.moredata = false;

    // $scope.loadMoreData=function()
    // {
    //   self.items.push(self.dados[i]);
    //   i++;
    //   if(self.items.length==count)
    //   {
    //     $scope.moredata=true;
    //   }
    //   $scope.$broadcast('scroll.infiniteScrollComplete');
    // };
    // self.items=[];




    //Função para mudar view para dados
    self.viewData = function(id) {
      $state.go("app.dados", { id: id });
    };
  }
  ]);
