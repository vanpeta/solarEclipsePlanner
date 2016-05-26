(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("airbnbController", airbnbController);

  airbnbController.$inject = ["$http", "$stateParams"];

  function airbnbController($http, $stateParams) {
    var vm = this;


var cities = ["Los Angeles","San Francisco","Miami","Austin"]

    vm.test="test"
    vm.airbnbSearch = airbnbSearch;
    vm.cities = cities;
    vm.houses = []
    vm.beds = beds;
    vm.bedrooms = bedrooms;
    vm.bathrooms = bathrooms;

    airbnbSearch($stateParams.city)

    function airbnbSearch(city) {
      city=encodeURIComponent(city);
      var promise = $http({
        method: 'GET',
        url:    '/airbnb?city='+city
      });
      promise.then(
        function(res){
          vm.houses = JSON.parse(res.data).search_results
          console.log(vm.houses)
        })
    }

    function beds(house) {
      if (house.listing.beds == 1) {
        return "1 bed";
      } else {
        return house.listing.beds + " beds";
      }
    }

    function bedrooms(house) {
      if (house.listing.bedrooms == 1) {
        return "1 bedroom";
      } else {
        return house.listing.bedrooms + " bedrooms";
      }
    }

    function bathrooms(house) {
      if (house.listing.bathrooms == 1) {
        return "1 bathroom";
      } else {
        return house.listing.bathrooms + " bathrooms";
      }
    }
  }
})()
