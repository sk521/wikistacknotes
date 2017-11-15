// /wiki/
// /wiki/add
// /wiki/SomePage

const express = require('express');
const router = express.Router();
const models = require('../models');
const Page = models.Page;
module.exports = router;


// RETRIEVE ALL WIKI PAGES
//GET /WIKI
router.get('/', function (req, res, next) {
  // PAGE.FINDALL gives us a list of all the pages/items from the sequelize database
  Page.findAll({})
    .then(function(thePages) {
      res.render('index', {
        pages: thePages
      })
    })
    .catch(next);
});

//SUBMIT A NEW PAGE TO THE DATABASE
// POST /WIKI
router.post('/', function(req, res, next) {

  // title, content, status
  var newPage = Page.build(req.body);

  // .save takes ^ the instance/object from the JS and put it into my database
  // this is asynchronous, this is going to return a promise
  newPage.save()
    .then(function(savedPage) {
      res.redirect(savedPage.route);
    })
    .catch(next);
});


//RETRIEVE THE "ADD A PAGE" FORM
// GET /WIKI/ADD
router.get('/add', function(req, res) {
  res.render('addpage');
});



// /WIKI/Javascript
// GET /WIKI/ADD needs to be above this because of the ':' in urlTitle
// It will think ADD is a name of an article
router.get('/:urlTitle', function(req, res, err) {

  var urlTitleOfAPage = req.params.urlTitle;

  // .FIND returns us an array of pages** even if it gives us back one page
  // .FINDONE returns us back one page and can write in the parameters page!
  Page.findOne({
    where: {
      urlTitle: urlTitleOfAPage
    }
  })
    .then(function(page) {

      if (page === null) {
        return next(new Error('That page was not found!'));
      }

      // goes into our views folder and to the file wikipage.html
      res.render('wikipage', {
        page: page
      });

    })
    .catch(err);
});
