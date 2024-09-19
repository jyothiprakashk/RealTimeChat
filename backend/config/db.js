const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Conncted to db ${connect.connection.host}`);
  } catch (err) {
    console.log(err, "Error while connecting db");
  }
};

module.exports = connectDB;
