var mongoose = require('mongoose');

//Use different database URIs based on whether an env vas exists.

var dbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/' + process.env.Local_DB;

if (!process.env.MONGOLAB_URI) {
  //check that MongoD is running..
  require('net').connect(27017, 'localhost').on('error', function() {
    console.log("MongoD not running or not found");
    process.exit(0);
  })
}

mongoose.connect(dbUri);

module.exports = mongoose
