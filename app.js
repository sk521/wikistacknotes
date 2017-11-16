var express = require('express');
var nunjucks = require('nunjucks');
var morgan = require('morgan');
var bodyParser = require('body-parser');


var models = require('./models');
var Page = models.Page;
var User = models.User;


var app = express();
var wikiRouter = require('./routes/wiki');
var usersRouter = require('./routes/users');


app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));


// PUT HERE BECAUSE WE WANT THE REQUEST TO GO THROUGH LINES 16 -22 of APP.JS
// ANYTHING THAT STARTS WITH "/WIKI" (THE REQUEST), GET PIPED INTO THE SUBROUTER(WIKIROUTER)
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);


app.engine('html', nunjucks.render);
nunjucks.configure('views');
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.render('index');
});

// ERROR HANDLING MIDDLEWARE
// MUST include all four things in the parameter or else Express will not know this is an
// error middleware
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send(err.message);
});


// WE ARE RETURNED A PROMISE ANYTIME WE INTERACT WITHA DB SYNC USER MODEL: If it doesnt exist create a User table, and if it already exists match the columns with the given scheme
User.sync()

  // Our .then success function
  // Which means once User syncs and is successful, start Page sync for our page model
  .then(function () {
    // write 'return' so next .then function has to wait until previous is complete
    return Page.sync();
  })
  .then(function () {
    app.listen(3001, function() {
      console.log('Server is listening on port 3001!');
    });
  });
