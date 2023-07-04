const { User } = require("./database");
const LocalStrategy = require("passport-local").Strategy;
exports.initializePassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });

        if (!user)
          return done(null, false, { message: "No user with that username" });

        if (user.password !== password)
          return done(null, false, { message: "Password incorrect" });

        return done(null, user);
      } catch (error) {
        return done(error, false, { message: "Error" });
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false, { message: "Error" });
    }
  });
};
