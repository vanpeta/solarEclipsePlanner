(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("mapController", mapController);

  mapController.$inject = ["$http", "$stateParams"];

  function mapController($http, $stateParams) {
    var vm = this
    var lat = ''
    var lng = ''

    var cities = {}
    vm.cities = cities;
    vm.test=('test')
    vm.lat=lat;
    vm.lng=lng;
    vm.getCities=getCities;


/*
get a list of nearby postcodes, based on lat and lng
look up the placename for each postcode
remove the duplicates
*/


    function getCities () {
      vm.lat = document.getElementById("hiddenLat").innerHTML;
      vm.lng = document.getElementById("hiddenLng").innerHTML;
      console.log(encodeURIComponent(vm.lng))
      console.log(encodeURIComponent(vm.lat))
      var promise = $http({
        method: 'GET',
        url: 'http://api.geonames.org/findNearbyPostalCodesJSON?lat='+vm.lat+'&lng='+vm.lng+'&username=vanpeta'
      });
      promise.then(
        function(res){
          vm.cities = res.data
          console.log(vm.cities)
        })
    }
  }
})()
