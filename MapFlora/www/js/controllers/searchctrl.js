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
    self.titulo = ""
    self.se = false;
    self.dados = [];
    self.todoVetor = [];
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
        self.todoVetor = data[0];
        self.dados = data[0];
        $ionicLoading.hide();
      } else {
        getPoints.get().then(function(res) {
          self.todoVetor = res.data;
          self.dados = res.data;
          dataService.put(res.data);
          $ionicLoading.hide();
        });
      }
    });


    setTimeout(function () {
      ionicMaterialMotion.blinds();
    },1000);

    self.filterHistory =  function(){
      self.dados = self.todoVetor.filter(function(valor){
          return valor.historia == true;
      });
    }

    self.filterFosseis =  function(){
      self.dados = self.todoVetor.filter(function(valor){
          return valor.fossil == true;
      });
    }

    self.filterInsetos = function(){
      self.dados = self.todoVetor.filter(function(valor){
        return valor.inseto == true;
      });
    }

    self.filterArvores = function(){
      self.dados = self.todoVetor.filter(function(valor){
        return (typeof valor.inseto == "undefined" || typeof valor.fossil == "undefined" || typeof valor.historia == "undefined")
      });
    }



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
      item = self.todoVetor.find(function(valor){
        return valor._id == id;
      });
      if(item.inseto){
        $state.go("app.dadosinsetos", { id: id });
      }else if(item.fossil){
        
        $state.go("app.dadosfosseis", { id: id });
      }else if(item.historia == true){
        
      }else if(typeof item.inseto == "undefined" || typeof item.fossil == "undefined" || typeof item.historia == "undefined"){
        
      }

      
    };
  }
  ]);
