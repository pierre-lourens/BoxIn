const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const cookieSession = require("cookie-session");
const router = require("./router.js");
const keys = require("./config/keys");
const User = require("./models/userSchema");

const app = express();

mongoose.connect(keys.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: ["helloworld"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "619348585502-7d3rn7ts232500ikjis32r9iol71ng72.apps.googleusercontent.com",
      clientSecret: "VMfIwZnG8QMNlfnin1ZuoaCI",
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then((existingUser) => {
        if (existingUser) {
          // we already have a record with the given profile ID
          done(null, existingUser);
        } else {
          // we don't have a user record with this ID, make a new record!
          new User({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

app.get("/api/auth/google", googleAuth);

app.get("/api/auth/google/callback", googleAuth, (req, res) => {
  console.log("Input validated via Google");

  if (process.env.NODE_ENV !== "production") {
    // Express will serve up the index.html file
    // if it doesn't recognize the route
    res.redirect("http://localhost:3000");
  } else {
    res.redirect("/");
  }
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(null, user);
  });
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router(app);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port);
console.log("Server listening on:", port);
