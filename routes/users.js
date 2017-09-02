var express = require('express');
var router = express.Router();
var multer = require("multer");
var upload = multer({
  dest: "./uploads"
});

var User = require("../models/user");

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
  res.render("register", {
    title: "Register"
  });
});

router.get('/login', function (req, res, next) {
  res.render("login", {
    title: "Login"
  });
});

router.post('/register', upload.single("profileimage"), function (req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  if (req.file)
    var profileimage = req.file.filename;
  else
    var profileimage = "noimage.jpg";


  req.checkBody("name", "Name field is required").notEmpty();
  req.checkBody("email", "Email field is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username field is required").notEmpty();
  req.checkBody("password", "Password field is required").notEmpty();
  req.checkBody("password2", "Password do not match").equals(password);

  var errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors
    });
    
  } else {
    var newUser = new User({
      name,
      email,
      username,
      password,
      profileimage,
    });

    User.createUser(newUser, (err, user) => {
      if(err) throw err;
      console.log(user);
    });

    req.flash("success", "You are now registered and can login");

    res.location("/");
    res.redirect("/");
  }

});

module.exports = router;