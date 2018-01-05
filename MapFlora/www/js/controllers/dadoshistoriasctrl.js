angular.module("starter.controllers").controller("DadosHistoriasCtrl", [
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

    dataService.getByIdJSON(
      self.id,
      function(res) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i]._id == self.id) {
            self.dados = angular.copy(res.data[i]);
            console.log(self.dados);
            oneACt = {
              idUser: TokenFactory.getInfo().id,
              email: TokenFactory.getInfo().email,
              act:
                "Visualizou uma história " +
                res.data[i].titulo +
                " em " +
                dataAtualFormatada(),
              date: new Date(),
              uploaded: false
            };
            $http.get("img/historico/" + self.id + ".jpg").then(
              function() {
                self.source = "img/historico/" + self.id + ".jpg";
                $scope.apply;
              },
              function() {
                self.source = "img/stan.jpg";
                $scope.apply;
              }
            );
            ActivityFactory.add(oneACt);
          }
        }
        // }
      },
      function(err) {
        console.log(err);
      }
    );

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

    //Timeout para realizar animações
    $timeout(function() {
      ionicMaterialMotion.slideUp({
        selector: ".slide-up"
      });
    }, 300);

    self.verify = function(dado){
      return !(dado == '-1' || dado == '.' || dado == '')
    }



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
