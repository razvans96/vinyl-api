const mongoose = require("mongoose");
require("dotenv").config();

const isTestEnvironment = process.env.NODE_ENV === "test";

console.log(process.env.TEST_MONGODB_URI);

const dbURI = isTestEnvironment
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(dbURI);
    console.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  await mongoose.connection.close();
  console.log("Conexión a la base de datos cerrada");
};

module.exports = { connectDB, closeDB };
