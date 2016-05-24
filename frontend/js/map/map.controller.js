(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("mapController", mapController);

  mapController.$inject = [];

  function mapController() {
    var vm = this

    var latlng = document.getElementById("latlngCursor").innerHTML

    var cities = ["Los Angeles","San Francisco","Miami","Austin"]
    vm.cities = cities;
    vm.latlng = latlng;
    vm.test=('test')



  }
})()
