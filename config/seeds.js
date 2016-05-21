require('dotenv').load();
var mongoose = require('./database');

var User = require('../models/user');

var users = [
  {
    username: "callende",
    email: "yo@email.com",
    favorites: {
      houses: "https://www.airbnb.com/rooms/7350913?checkin=08%2F10%2F2017&checkout=08%2F11%2F2017&guests=1&s=6k-_XmFu"
      }
    },
    {
    username: "jepsica",
    email: "jess@email.com",
    favorites: {
      houses: "https://www.airbnb.com/rooms/2516256?checkin=08%2F10%2F2017&checkout=08%2F11%2F2017&guests=1&s=6k-_XmFu"
      }
    }
];

User.remove({}, function (err) {
  if (err) console.log(err);
  User.create(users, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      console.log("Database seeded with " + users.length + " users.");
      mongoose.connection.close();
    }
    process.exit();
  });
});
