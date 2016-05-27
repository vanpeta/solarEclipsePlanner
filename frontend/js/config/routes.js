(function() {
  angular.module('solarEclipsePlanner')
    .config(MainRouter);

  MainRouter.$inject = ['$stateProvider', '$urlRouterProvider'];

  function MainRouter($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'home.html',
        controller:   "SignInController",
        controllerAs: "vm"
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
      .state("signup", {
        url:          "/signup",
        templateUrl:  "/js/auth/signup.html",
        controller:   "SignInController",
        controllerAs: "vm"
      })
      .state("favorites", {
        url: "/favorites",
        templateUrl: "js/airbnb/favorites.html",
        controller: "airbnbController",
        controllerAs: "vm"
      });
    $urlRouterProvider.otherwise('/');
  }
})();
