module.exports = {
  getHouses: getHouses
}

var https = require('https');
var rp = require('request-promise');
var $ = require('cheerio');


function getHouses(req,res,next) {
  // var city = require('../frontend/js/map/map.controller.js')
  var city = encodeURIComponent(req.query.city)
  rp({
    url: 'https://api.airbnb.com/v2/search_results?client_id=3092nxybyb0otqw18e8nh5nty&locale=en-US&currency=USD&_format=for_search_results_with_minimal_pricing&_limit=30&_offset=0&fetch_facets=true&guests=1&ib=false&ib_add_photo_flow=true&location='+city+'&min_bathrooms=0&min_bedrooms=0&min_beds=1&min_num_pic_urls=10&price_max=210&price_min=40&sort=1&&checkin=2017-08-21&checkout=2017-08-22',
    /*'https://www.airbnb.com/Los-Angeles?guests=&checkin=08%2F21%2F2017&checkout=08%2F22%2F2017&ss_id=lhqpr1a4&source=bb&s_tag=YjHnSdsD',*/
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    },
    /*transform: function (body) {
      return $.load(body);
    }*/
  })
  .then(function(airbnbRes) {
    /*var houses = $('.listing')
    console.log (houses)*/
    res.json(airbnbRes)
  })
  .catch(console.error)
};
