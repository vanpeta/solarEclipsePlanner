(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("NavbarController", NavbarController);

  NavbarController.$inject = ["$log", "authService", "$scope", "$location"];

  function NavbarController($log, authService, $scope, $location) {
    var vm = this;

    vm.authService = authService;
    vm.currentPath = currentPath;
    vm.showMapLinkInHouses = showMapLinkInHouses;

    $log.info("NavbarController loaded!");

    function currentPath () {
      $scope.currentPath = $location.path();
      return $scope.currentPath
    };
console.log(currentPath())

    function showMapLinkInHouses () {
      $scope.currentPath = $location.path();
      if ($scope.currentPath.includes('houses'))
        return true;
      else false
    }

    $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal({in_duration: 500});
    });
  }
})();
