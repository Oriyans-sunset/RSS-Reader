const express = require("express");
const app = express();
const { connectMongoose, User } = require("./database");
const passport = require("passport");
const { initializePassport } = require("./passportConfig");
const expressSession = require("express-session");
const cors = require("cors");

connectMongoose();
initializePassport(passport);

app.use(
  cors({
    origin: "*",
  })
);
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    res.status(400).send("User already exists");
  } else {
    const newUser = await User.create(req.body);
    res.status(200).send("User created successfully");
  }
});

app.post("/login", passport.authenticate("local"), async (req, res) => {
  res.status(200).send("Login successful");
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
