angular
  .module("starter.controllers")
  .controller("DadosCtrl", [
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
      ionicMaterialInk
    ) {
      var self = this;
      //Recebe o id via url
      self.id = $stateParams.id;
      self.dados = {};

      function dataAtualFormatada() {
        var data = new Date();
        var dia = data.getDate();
        if (dia.toString().length == 1) dia = "0" + dia;
        var mes = data.getMonth() + 1;
        if (mes.toString().length == 1) mes = "0" + mes;
        var ano = data.getFullYear();
        return dia + "/" + mes + "/" + ano;
      }

      //Busca no serviço pelo id da arvore
      dataService.getById(self.id).then(function(data) {
        oneACt = {
          idUser: TokenFactory.getInfo().id,
          email: TokenFactory.getInfo().email,
          act:
            "Visualizou uma " + data.nome_cie + " em " + dataAtualFormatada(),
          date: new Date(),
          uploaded: false
        };

        $http.get("img/trees/" + self.id + ".jpg").then(
          function() {
            self.source = "img/trees/" + self.id + ".jpg";
            self.dados = data;
            $scope.apply;
          },
          function() {
            self.source = "img/stan.jpg";
            self.dados = data;
            $scope.apply;
          }
        );
        $timeout(function() {
          ActivityFactory.add(oneACt);
          ActivityFactory.upload();
        }, 5000);
      });

      //Timeout para realizar animações
      $timeout(function() {
        ionicMaterialMotion.slideUp({
          selector: ".slide-up"
        });
      }, 300);

      //ativação de animações
      ionicMaterialInk.displayEffect();
    }
  ]);
