var express = require ('express');
var router = express.Router();
var usersController = require('../controllers/users');

// Require token authentication.
var token = require('../config/token_auth');

/* GET home page */
router.get('/', function (req, res, next) {
  res.sendfile('frontend/index.html');
});


/* API Routes */
router.route('/api/users')
  .get(usersController.index)
  .post(usersController.create)
router.route('api/users/:id')
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.destroy)

  /* Auth Routes */
router.route('/api/users/me')
  .post(token.authenticate, usersController.me)
router.route('api/token')
  .post(token.create);

module.exports= router;
