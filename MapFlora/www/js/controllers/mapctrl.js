angular
  .module("starter.controllers")
  .controller("MapCtrl", [
    "getPoints",
    "$scope",
    "$ionicLoading",
    "$cordovaGeolocation",
    function(getPoints, $scope, $ionicLoading, $cordovaGeolocation) {
      //Função para marcar no mapa
      function marks() {
        //Captura os pontos em um serviço
        getPoints.get().then(
          function(res) {
            //recebe os dados das arvores
            var forest = res.data;
            mark = [];
            popup = [];
            //Realiza um laço para distribuir os pontos no mapa
            for (var i = 0; i < forest.length; i++) {
              if (forest[i].loc.length > 1) {
                console.log(forest[i].loc);
                for (var j = 0; j < forest[i].loc.length; j++) {
                  lat = Number.parseFloat(forest[i].loc[j].lat);
                  long = Number.parseFloat(forest[i].loc[j].lng);

                  info = forest[i].nome_pop;
                  var image = "img/tree.png";
                  ma = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    title: info,
                    icon: image,
                    position: new google.maps.LatLng(lat, long),
                    info: info
                  });
                  var conteudo = forest[i];
                  atach(conteudo, ma);
                }
              }
            }

            //Função para fixar uma infowindow ao seu respectivo ponto
            function atach(msg, mark) {
              var infoWindow = new google.maps.InfoWindow({
                content:
                  "<div>" +
                  '<div class="iw-head"><b>' +
                  msg.nome_cie +
                  "</b></div>" +
                  '<div class="iw-content">' +
                  '<div class="iw-pop">' +
                  msg.nome_pop +
                  "</div>" +
                  '<img src="img/trees/' +
                  msg._id.$oid +
                  '.jpg" height="140" width="240">' +
                  "<p> <b>Clima: </b>" +
                  msg.clima +
                  "<br> <b>Origem:</b> " +
                  msg.origem +
                  "<br>" +
                  "</div>" +
                  '<a href="#/app/dados/' +
                  msg._id.$oid +
                  'class="iw-subTitle">Mais Dados</a>' +
                  '<div class="iw-bottom-gradient"></div>' +
                  "</div>",
                maxWidth: 500
              });

              //Add um listener ao mark para quando clicado abrir a info window
              mark.addListener("click", function() {
                infoWindow.open(mark.get("map"), mark);
              });
            }
          },
          function(err) {
            console.log(err);
          }
        );
      }

      //Inicia a marcação
      marks();

      //Mudar view
      $scope.go = function(id) {
        $state.go("app.dados", { id: id });
      };

      //Criando o map
      $scope.mapCreated = function(map) {
        $scope.map = map;
      };

      //Função para centralizar no usuario
      $scope.centerOnMe = function() {
        console.log("Centering");
        if (!$scope.map) {
          console.log("Não existe");
          return;
        }
        $ionicLoading.show({
          content: "Localizando",
          showBackdrop: true
        });
        navigator.geolocation.getCurrentPosition(
          function(pos) {
            console.log("Centering");
            console.log("Got pos", pos);
            $ionicLoading.hide();
            $scope.map.setCenter(
              new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
            );
          },
          function(error) {
            $ionicLoading.hide();
            alert("Erro ao procurar localização: " + error.message);
          },
          { timeout: 10000 }
        );
      };
    }
  ])