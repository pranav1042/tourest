const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Pranav",
    email: "test@gmail.com",
    password: hashedPassword,
  });

  console.log("✅ User Created");
  process.exit();
});
