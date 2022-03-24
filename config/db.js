const mongoose = require('mongoose')
const config = require('../config/config.js')

let connectionDb = config.dbProduction

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(connectionDb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    console.log("MongoDB connected")
  } catch (err) {
    console.log(`Error: ${err.message}`.red)
    process.exit(1)
  }
}

module.exports= connectDb;

