(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("mapController", mapController);

  mapController.$inject = ["$http"];

  function mapController($http) {
    var vm = this;
    var cities = ["Los Angeles","San Francisco","Miami","Austin"]

    vm.airbnbSearch = airbnbSearch;
    vm.cities = cities;


    function airbnbSearch(city) {
      console.log("airbnbSearch function triggered")
      //city=city.replace(/ /g,"-");
      var promise = $http({
        method: 'GET',
        url:    '/airbnb',
      })
      console.log(promise)
    }
  }
})()
