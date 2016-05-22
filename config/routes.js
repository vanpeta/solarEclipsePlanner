var express = require ('express');
var router = express.Router();
var usersController = require('../controllers/users');

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

module.exports= router;
