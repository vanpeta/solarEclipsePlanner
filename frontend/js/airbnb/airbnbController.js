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
  }
})()
