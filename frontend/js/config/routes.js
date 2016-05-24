(function() {
  angular.module('solarEclipsePlanner')
    .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home.html'
      })
      .state('map', {
        url: '/map',
        templateUrl: 'js/map/map.html',
        controller: "mapController",
        controllerAs: "vm"
      })
      .state('houses', {
        url: '/houses/:city',
        templateUrl: '/js/airbnb/houses.html',
        controller: "airbnbController",
        controllerAs: "vm"
      })
      .state("signin", {
        url:          "/signin",
        templateUrl:  "/js/auth/signin.html",
        controller:   "SignInController",
        controllerAs: "vm"
      });
    $urlRouterProvider.otherwise('/');
  }
})();
