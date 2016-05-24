(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("mapController", mapController);

  mapController.$inject = [];

  function mapController() {
    var vm = this

    var cities = ["Los Angeles","San Francisco","Miami","Austin"]
    vm.cities = cities;
  }
})()
