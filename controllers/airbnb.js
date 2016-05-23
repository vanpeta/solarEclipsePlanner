module.exports = {
  getHouses: getHouses
}

var https = require('https');
var rp = require('request-promise')
//var $ = require('jQuery');

function getHouses(req,res,next) {
  // var city = require('../frontend/js/map/map.controller.js')
  var options = {
    host: 'https://www.airbnb.com',
    path: /* city+ */'/Los-Angeles?guests=&checkin=08%2F21%2F2017&checkout=08%2F22%2F2017'
  }
  rp({
    url: 'https://www.airbnb.com/Los-Angeles?guests=&checkin=06%2F15%2F2016&checkout=06%2F16%2F2016&ss_id=lhqpr1a4&source=bb&s_tag=YjHnSdsD',
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"}
    })
    .then(console.log)
    .catch(console.error)

};
