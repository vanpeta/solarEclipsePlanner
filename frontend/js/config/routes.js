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
        templateUrl: 'map.html'
      })
      .state('results', {
        url: '/results',
        templateUrl: 'results.html'
      })
    $urlRouterProvider.otherwise('/');
  }
})();
