module.exports = {
  getCities: getCities
}

var https = require('https');
var rp = require('request-promise');

function getCities(req,res,next) {
  var lat = encodeURIComponent(req.query.lat)
  var lng = encodeURIComponent(req.query.lng)

  rp({
    url: 'http://api.geonames.org/findNearbyPostalCodesJSON?lat='+lat+'&lng='+lng+'&radius=30&maxRows=200&username=vanpeta',
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
    },
  })
  .then(function(geonamesRes) {
    console.log(geonamesRes)
    res.json(geonamesRes)
  })
  .catch(console.error)
};
