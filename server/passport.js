const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userDB = require("./models/usersModel");
const bcrypt = require("bcrypt");
const passportJWT = require("passport-jwt");
const ObjectId = require("mongodb").ObjectId;
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    function (email, password, done) {
      userDB.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: "Password or Username is Incorrect",
          });
        }
        try {
          const match = bcrypt.compareSync(password, user.password);
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password or Username is Incorrect",
            });
          }
        } catch (error) {
          return done(err);
        }
      });
    }
  )
);

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "secret";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    userDB.findById(jwt_payload._id, function (err, user) {
      console.log("user found");
      console.log(user);
      if (err) {
        return done(err, false);
      }
      if (user) {
        console.log(user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
