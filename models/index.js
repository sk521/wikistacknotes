var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
  title: {
    // .STRING has a text constraint default 1500
    type: Sequelize.STRING,
    // saying that this cant be false!
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    // .TEXT has no constraint
    type: Sequelize.TEXT,
    allowNull: false
  },
  status: {
    // ENUM says this status can only be these two values
    // that are inputted between the parenthesis
    type: Sequelize.ENUM('open', 'closed')
  }
}, {
  hooks: {
    beforeValidate: function (page) {
      if (page.title) {

        // s+ means spaces \W/ means any other white space
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      }
    }
  },
  // We dont call them we access them like regular properites (virtuals)
  // wikipage.html we can just write now page.route(lines 11,12)
  // a getter property we access like a normal property, it calls a function in the background (route:function)
  // powered object defined property, give you the return value of a function even though we are not calling the function
  getterMethods: {
    route: function() {
      return '/wiki/' + this.urlTitle;
    }
  }
});

var User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
});

// A Page belongs to a User as author
// Creates a column in the table 'authorid'
Page.belongsTo(User, { as: 'author' });


module.exports = {
  Page: Page,
  User: User
}
