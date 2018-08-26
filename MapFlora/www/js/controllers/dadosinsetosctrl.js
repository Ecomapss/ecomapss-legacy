angular.module("starter.controllers").controller("DadosInsetosCtrl", [
  "$scope",
  "$timeout",
  "TokenFactory",
  "ActivityFactory",
  "$http",
  "$stateParams",
  "dataService",
  "$timeout",
  "ionicMaterialMotion",
  "ionicMaterialInk",
  "$state",
  "$ionicActionSheet",
  function(
    $scope,
    $timeout,
    TokenFactory,
    ActivityFactory,
    $http,
    $stateParams,
    dataService,
    $timeout,
    ionicMaterialMotion,
    ionicMaterialInk,
    $state,
    $ionicActionSheet
  ) {
    var self = this;
    //Recebe o id via url
    self.id = $stateParams.id;
    self.dados = {};

    dataService.getById(self.id).then(
      function (res) {
        self.dados = angular.copy(res[0]);
        oneACt = {
          idUser: TokenFactory.getInfo().id,
          email: TokenFactory.getInfo().email,
          act:
            "Visualizou fauna " +
            self.dados.ordem +
            " em " +
            dataAtualFormatada(),
          date: new Date(),
          uploaded: false
        };
        $http.get("fauna/" + self.id + ".jpg").then(
          function () {
            self.source = "fauna/" + self.id + ".jpg";
            $scope.apply;
          },
          function () {
            self.source = "img/stan.jpg";
            $scope.apply;
          }
        );
        ActivityFactory.add(oneACt);
      }).catch(
        function (err) {
          console.log(err);
      });


    self.go = function(loc, nome_p) {
      dataService.clearLoc();
      dataService.setLocatios(loc);
      $state.transitionTo("app.map", null, {
        reload: true
      });
    };
    self.go = function(loc, nome_p) {
      dataService.clearLoc();
      dataService.setLocatios(loc);
      $state.transitionTo("app.map", null, {
        reload: true
      });
    };

    function dataAtualFormatada() {
      var data = new Date();
      var dia = data.getDate();
      if (dia.toString().length == 1) dia = "0" + dia;
      var mes = data.getMonth() + 1;
      if (mes.toString().length == 1) mes = "0" + mes;
      var ano = data.getFullYear();
      return dia + "/" + mes + "/" + ano;
    }



    self.verify = function(dado){
      return !(dado == '-1' || dado == '.' || dado == '')
    }


    //Timeout para realizar animações
    $timeout(function() {
      ionicMaterialMotion.slideUp({
        selector: ".slide-up"
      });
    }, 300);


    // Informações
  $scope.showMore = function(title, data) {
    $ionicActionSheet.show({
      titleText: title+': ' + data,
      cancelText: 'Fechar',
      cancel: function() {
        console.log('CANCELLED');
      },
      buttonClicked: function(index) {
        console.log('BUTTON CLICKED', index);
        return true;
      },
      destructiveButtonClicked: function() {
        console.log('DESTRUCT');
        return true;
      } 
    });
  };

    //ativação de animações
    ionicMaterialInk.displayEffect();
  }
]);
