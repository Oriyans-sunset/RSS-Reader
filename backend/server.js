const express = require("express");
const app = express();
const { connectMongoose, User } = require("./database");
const passport = require("passport");
const { initializePassport } = require("./passportConfig");
const expressSession = require("express-session");
const sessionStore = new expressSession.MemoryStore();
const cors = require("cors");
const getRSSFeed = require("./utility/GetRSSFeed");
const jwt = require("jsonwebtoken");

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
    store: sessionStore,
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

function generateAuthToken(user) {
  const payload = {
    // Include any user-specific data you want in the token payload
    username: user.username,
  };

  const token = jwt.sign(payload, "secret", {
    expiresIn: 2 * 7 * 24 * 60 * 60, // Set the token expiration time as desired
  });

  return token;
}

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, "secret"); // Verify the token using your secret key

      // Access the decoded payload, e.g., username
      const username = decoded.username;

      // You can optionally add the decoded payload to the request object for future use
      req.user = decoded;

      return next();
    } catch (error) {
      // Token verification failed
      console.error("Token verification failed:", error);
    }
  }

  res.status(401).json({ error: "Unauthorized" });
};

app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (user) {
    res.status(400).send("User already exists");
  } else {
    const newUser = await User.create(req.body);
    const token = generateAuthToken(newUser);
    res.status(200).json({ token });
  }
});

app.post("/login", passport.authenticate("local"), async (req, res) => {
  const token = generateAuthToken(req.user);

  res.status(200).json({ token });
});

app.get("/websites", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    let response = [];

    if (user.websites === null)
      res.status(200).json({ message: "No websites added yet." });

    for (let i = 0; i < user.websites.length; i++) {
      let feedObj = {};
      if (user.websites[i]) {
        try {
          const feed = await getRSSFeed(user.websites[i]);
          feedObj["name"] = feed.title;
          feedObj["icon"] = feed.image ? feed.image.url[0] : feed.icon;
          feedObj["numberOfArticles"] = feed.items.length;
          feedObj["url"] = user.websites[i];
          response.push(feedObj);
        } catch (error) {
          console.log(error);
          response.push({ error: "Invalid URL", name: "Invalid RL" });
        }
      } else {
        continue;
      }
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/websites", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  const { website } = req.body;

  user["websites"].push(website);
  await user.save();
  res.status(200).json("Website added successfully.");
});

app.put("/websiteDelete", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  const { url } = req.body;

  user["websites"].remove(url);
  await user.save();
  res.status(200).json("Website removed successfully.");
});

app.post("/articles", async (req, res) => {
  try {
    let response = [];
    try {
      const feed = await getRSSFeed(req.body.url);
      for (let i = 0; i < feed.items.length; i++) {
        articleObj = {};
        articleObj["title"] = feed.items[i].title;
        articleObj["url"] = feed.items[i].id
          ? feed.items[i].id
          : feed.items[i].link;
        articleObj["content"] = feed.items[i].content
          ? feed.items[i].content
          : feed.items[i].description;
        articleObj["date"] = feed.items[i].published
          ? feed.items[i].published
          : feed.items[i].pubDate;
        response.push(articleObj);
      }
    } catch (error) {
      console.log(error);
      response.push({ error: "Invalid URL" });
    }
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/changeUsername", ensureAuthenticated, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  const changedUsername = req.body.changedUsername;

  // Update req.user with the new username
  req.user.username = changedUsername;

  user.username = changedUsername;
  const updatedUser = await user.save();
  res.json(updatedUser);
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});
