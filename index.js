const express = require('express')
const bodyParser = require('body-parser');

//Environment Variables
const TWILIO_ACCOUNT_SID = process.env.ACCOUNT_SID;
const TWILIO_API_KEY = process.env.API_KEY;
const TWILIO_API_SECRET = process.env.API_SECRET;
const VALID_PASSCODE = process.env.PASSCODE;
const ROOM_NAME = process.env.ROOM_NAME;

const AccessToken = require('twilio').jwt.AccessToken

const app = express(); // Creates an app for your servers client

app.use(bodyParser.json()); // Express modules / packages
app.use(bodyParser.urlencoded({ extended: true })); // Express modules / packages

app.use(express.static('public')); // load the files that are in the public directory

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});


app.get('/video-token', (req, res) => {
  console.log("video token request received")
  if (req.query.passcode !== VALID_PASSCODE) {
    res.status(401).send('Invalid passcode')
  }

  const { VideoGrant } = AccessToken;
  /*
   * only tokens are available for participating rooms
   * Create a Video grant enabling client to use Video, only for this room
   */
  const videoGrant = new VideoGrant({
    room: ROOM_NAME,
  });
  // Create an access token to sign and return to the client with the grant we just created
  const accessToken = new AccessToken(
    TWILIO_ACCOUNT_SID,
    TWILIO_API_KEY,
    TWILIO_API_SECRET
  );
  accessToken.addGrant(videoGrant); // Add the grant to the token
  accessToken.identity = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15); // generate random client name
  const responseJson = {
    token: accessToken.toJwt(), // Serialize the token to a JWT string
    roomName: ROOM_NAME,
  }
  res.json(responseJson) //send json to the client
})

app.listen(3000, () => console.log('server started'));
