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

    $log.info("NavbarController loaded!");

    function currentPath () {
      $scope.currentPath = $location.path();
      return $scope.currentPath
    };


    $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal({in_duration: 500});
    });
  }
})();
