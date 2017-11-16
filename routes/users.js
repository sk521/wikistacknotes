const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
var Promise = require('bluebird');
module.exports = router;


// GET /users
// Gives us a list of users
router.get('/', function(req, res, next) {

  User.findAll()
    .then(function(users) {
      res.render('users', {
        users: users
      });
    })
    .catch(next);
});



// GET /users/id
// Gives us pages written by a SINGLE user
router.get('/:userId', function(req, res, next) {

  var findingUserPages = Page.findAll({
    where: {
      authorId: req.params.userId
    }
  });

  var findingUser = User.findById(req.params.userId);

  Promise.all([
    findingUserPages, findingUser
  ])
      // values gives us two values
    .then(function(values) {

      // the pages the user has written
      var pages = values[0];

      // the user that wrote these pages
      var user = values[1];

      user.pages = pages;

      res.render('userpage' , {
        user: user
      });
    })
    .catch(next);
});
