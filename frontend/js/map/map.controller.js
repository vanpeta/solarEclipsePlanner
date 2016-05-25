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

    var cities = []
    vm.cities = cities;
    vm.test=('test')
    vm.lat=lat;
    vm.lng=lng;
    vm.getCities=getCities;


/*
To get the cities:
•We'll get latitude and longitude from clicks on the map
We'll use geonames.org API to:
•get a list of nearby postcodes, based on lat and lng
•look up the placename for each postcode
•remove the duplicates
*/


    function getCities () {
      vm.lat = document.getElementById("hiddenLat").innerHTML;
      vm.lng = document.getElementById("hiddenLng").innerHTML;
      console.log(encodeURIComponent(vm.lng))
      console.log(encodeURIComponent(vm.lat))
      var promise = $http({
        method: 'GET',
        url: 'http://api.geonames.org/findNearbyPostalCodesJSON?lat='+vm.lat+'&lng='+vm.lng+'&radius=20&username=vanpeta'
      });
      promise.then(
        function(res){
          res.data.postalCodes.forEach(function(e){
            if (vm.cities.indexOf(e.adminName2) === -1){
              vm.cities.push(e.adminName2)
            }
          })
          console.log(vm.cities)
          return(vm.cities)
        })
    }
  }
})()
