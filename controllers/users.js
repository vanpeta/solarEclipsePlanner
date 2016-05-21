var User = require('../models/user.js')

module.exports = {
  index: index,
  show: show,
  create: create,
  update: update,
  destroy: destroy
}

function index(req,res,next) {
  User.find({}, function(err, users) {
    if (err) next(err);
    res.json(users);
  });
};

function show(req, res, next){
  var id = req.params.id;
  User.findById(id, function(err, user){
    if (err) next(err);
    res.json(show);
  });
};

function create (req,res,next) {
  var newUser = new User(req.body);

  newUser.save(function(err, savedUser) {
    if (err) next (err);
    res.json(savedUser);
  });
};

function update (req,res,next) {
  var id = req.params.id;
  User.findById(id, function(err, user) {
    if (err) next(err);
    user.username = req.body.username;
    user.email = req.body.email;
    user.save(function(err, updatedUser) {
      if (err) next(err);
    });
  });
};

function destroy (req,res,next) {
  var id = req.params.id;
  User.remove({_id:id}, function(err) {
    if (err) next(err);
    res.json({message: "User deleted"});
  });
};


