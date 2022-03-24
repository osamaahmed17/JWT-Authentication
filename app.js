const cors = require("cors")
const connectDb = require("./config/db.js")
const express = require("express")
const routes = require("./route/routes")
const dotenv = require("dotenv")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticationModel = require("./model/authenticationModel.js");
const PORT = process.env.PORT || 3000




dotenv.config();
const app = express()

app.use(express.json());




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
  res.header("Access-Control-Expose-Headers", "*")
  next();
});




app.post("/register", async (req, res) => {
  try {
    const clientId = req.headers.clientid;

    // Validate user input
    if (!(clientId)) {
      res.status(400).send("Client Id is required");
    }
    const foundClientId = await authenticationModel.findOne({ clientId });
    if (foundClientId) {
      return res.status(409).send("Client Id already exists");

    }
    // Create Client Id in our database
    const authenticationUser = await authenticationModel.create({
      clientId: clientId,
    });

    // Create Token
    const token = jwt.sign(
      { clientId: foundClientId },
      "random",
      {
        expiresIn: "1h",
      }
    );
    // save User Token
    authenticationUser.token = token;
    // returns a Token
    res.status(201).json({ "token": authenticationUser.token });
  } catch (err) {
    console.log(err);
  }
});


app.post("/login", async (req, res) => {
  try {
    // Get user clientId
    const clientId = req.headers.clientid;

    // Validate user input
    if (!(clientId)) {
      res.status(400).send("Client Id is required");
    }
    const foundClientId = await authenticationModel.findOne({ clientId });


    if (foundClientId ) {
      const token = jwt.sign(
        { clientId: foundClientId },
        "random",
        {
          expiresIn: "1h",
        }
      );
      // save User Token
      foundClientId.token = token;
      // returns a Token
      res.status(201).json({ "token": foundClientId.token });

    }

  } catch (err) {
    res.status(400).send("Invalid Credentials");
  }
});

connectDb()
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})


module.exports = app;



