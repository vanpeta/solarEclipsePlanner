(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("NavbarController", NavbarController);

  NavbarController.$inject = ["$log", "authService"];

  function NavbarController($log, authService) {
    var vm = this;

    vm.authService = authService;

    $log.info("NavbarController loaded!");

    $(document).ready(function(){
      // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
      $('.modal-trigger').leanModal({in_duration: 500});
    });
  }
})();
