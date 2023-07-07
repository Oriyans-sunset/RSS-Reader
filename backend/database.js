const mongoose = require("mongoose");

exports.connectMongoose = () => {
  mongoose
    .connect(
      "mongodb+srv://prastog1:abc123456@cluster0.gtuwegf.mongodb.net/users"
    )
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
