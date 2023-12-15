const mongoose = require("mongoose");

exports.connectMongoose = () => {
  mongoose
    .connect("mongodb+srv://arun:arun123@cluster0.p2xskhg.mongodb.net")
    .then((e) => console.log(`connected to mondodb: ${e.connection.host}`))
    .catch((e) => console.log(e));
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  websites: [],
});

exports.User = mongoose.model("User", userSchema);
