var express = require ('express');
var router = express.Router();
var usersController = require('../controllers/users');
router.route('/api/users')
  .get(usersController.index)
  .post(usersController.create)
router.route('api/users/:id')
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.destroy)

module.exports= router;
