(function() {
  "use strict";

  angular
    .module("solarEclipsePlanner")
    .controller("airbnbController", airbnbController);

  airbnbController.$inject = ["$http", "$stateParams"];

  function airbnbController($http, $stateParams) {
    var vm = this;

    var favorite = {};
    var cities = [];
    vm.airbnbSearch = airbnbSearch;
    vm.cities = cities;
    vm.houses = []
    vm.beds = beds;
    vm.bedrooms = bedrooms;
    vm.bathrooms = bathrooms;
    vm.addFavorite = addFavorite;
    vm.isFavorite = isFavorite;
    vm.user = { favorites: []};

    airbnbSearch($stateParams.city)
    $http({
      method: "GET",
      url: '/api/users/me'
    }).then(function (res) {
      console.log(res.data);
      vm.user = (res.data)
    })


    function airbnbSearch(city) {
      city=encodeURIComponent(city);
      var promise = $http({
        method: 'GET',
        url:    '/airbnb?city='+city
      });
      promise.then(
        function(res){
          vm.houses = JSON.parse(res.data).search_results
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



    function isFavorite(house) {
        for (var i =0; i<vm.user.favorites.length; i++) {
          if (house.listing.id == vm.user.favorites[i].listing.id) {
            return true;
          }
        }
        return false;
    }


    function addFavorite(house) {
      if (!isFavorite(house)) {
        //save the house in the user object
        vm.user.favorites.push(house);
        $http({method: 'PUT',
          url: "/api/users/"+vm.user._id,
          data: vm.user}).then(function(res) {
            vm.user = res.data;
          })
      } else {
        //find index of this house in user.favorites and remove it
        var index = vm.user.favorites.indexOf(house)
        vm.user.favorites.splice(index,1);
        console.log(index)
        $http({method: 'PUT',
          url: "/api/users/"+vm.user._id,
          data: vm.user}).then(function(res) {
            vm.user = res.data;
          })
      }
      isFavorite(house)
    }
  }
})()
