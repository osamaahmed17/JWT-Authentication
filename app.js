const cors = require("cors")
const connectDb = require("./config/db.js")
const express = require("express")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken");
const authenticationModel = require("./model/authenticationModel.js");
const PORT = process.env.PORT || 3000
const crypto = require('crypto');




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


const toBase64 = obj => {
  const str = JSON.stringify(obj);
  return Buffer.from(str).toString('base64');
};

const replaceSpecialChars = b64string => {
  return b64string.replace(/[=+/]/g, charToBeReplaced => {
    switch (charToBeReplaced) {
      case '=':
        return '';
      case '+':
        return '-';
      case '/':
        return '_';
    }
  });
};
const createSignature = (jwtB64Header, jwtB64Payload, secret) => {
  let siginature = crypto.createHmac('sha256', secret);
  siginature.update(jwtB64Header + '.' + jwtB64Payload);
  siginature = siginature.digest('base64');
  siginature = replaceSpecialChars(siginature);
  return siginature
}


app.post("/authentication", async (req, res) => {
  try {
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };
    const b64Header = toBase64(header);
    const jwtB64Header = replaceSpecialChars(b64Header);
    const payload = {
      issuer: "ckysnvge56shi0942mh3hmd5k",
      exp: 600000
    };
    const b64Payload = toBase64(payload);
    const jwtB64Payload = replaceSpecialChars(b64Payload);

    const secret = '1cb5284a-cd13-47f5-863a-0e04e1de44fe';
    const signature = createSignature(jwtB64Header, jwtB64Payload, secret);
    const jsonWebToken = jwtB64Header + '.' + jwtB64Payload + '.' + signature;
    res.status(201).json({ "token": jsonWebToken });


  } catch (err) {
    console.log(err);
  }
});







app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})


module.exports = app;



