const cors = require("cors")
const connectDb =require("./config/db.js")
const express = require("express")
const routes =require( "./route/routes")
const dotenv =require( "dotenv")



dotenv.config();
const app = express()

app.use(express.json());


const PORT = process.env.PORT || 3000
app.use(express.json())


const corsOptions = {
  credentials: true,
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.options("*", cors(corsOptions));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "HEAD, PUT, POST, GET, OPTIONS, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "POST, GET, PUT, DELETE, OPTIONS, HEAD, Authorization");
  res.header("Access-Control-Expose-Headers","*")
  next();
});

connectDb()





app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

//routes(app)

module.exports = app