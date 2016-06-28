(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("mapController", mapController);

  mapController.$inject = ["$http", "$stateParams", "$timeout"];

  function mapController($http, $stateParams, $timeout) {
    $timeout(function() {
      onLoad();
    });

    var vm = this;
    var lat = '';
    var lng = '';
    var cities = [];

    vm.cities = cities;
    vm.test=('test');
    vm.lat=lat;
    vm.lng=lng;
    vm.getCities=getCities;
    vm.loading = false;


/*
To get the cities:
•We'll get latitude and longitude from clicks on the map
We'll use geonames.org API to:
•get a list of nearby postcodes, based on lat and lng
•look up the placename for each postcode
•remove the duplicates
*/

    function getCities (lat,lng) {
      vm.loading=true;
      console.log("getcities function launched")
      lat = document.getElementById("hiddenLat").innerHTML;
      lng = document.getElementById("hiddenLng").innerHTML;
      var promise = $http({
        method: 'GET',
        url: '/geonames?lat='+lat+'&lng='+lng
      });
      promise.then(
        function(res){
          vm.loading=false;
          var response = JSON.parse(res.data).postalCodes
          console.log (response)
          vm.cities = [];
          response.forEach(function(e){
            if (vm.cities.map(function(i) {return i.name; }).indexOf(e.placeName) == -1){
              vm.cities.push({name: e.placeName, state: e.adminCode1})
            }
          })
          console.log(vm.cities)
          return(vm.cities)
        })
    }
  }
})()
