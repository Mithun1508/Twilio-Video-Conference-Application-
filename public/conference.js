const getPasscode = () => {
  const passcodeInput = document.getElementById('passcode') || {};
  const passcode = passcodeInput.value;
  return passcode;
};

function resetPasscodeInput() {
  const passcodeInput = document.getElementById('passcode') || {};
  passcodeInput.value = ''
}

const trackSubscribed = (div, track) => {
  div.appendChild(track.attach());
};

const trackUnsubscribed = (track) => {
  track.detach().forEach((element) => element.remove());
};

// connect participant
const participantConnected = (participant) => {
  console.log(`Participant ${participant.identity} connected'`);

  const participantsDiv = document.getElementById('participants');
  const div = document.createElement('div'); // create div for new participant
  div.id = participant.sid;

  participant.on('trackSubscribed', (track) => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach((publication) => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });
  participantsDiv.appendChild(div);
};

const participantDisconnected = (participant) => {
  console.log(`Participant ${participant.identity} disconnected.`);
  document.getElementById(participant.sid).remove();
};

(() => {
  const { Video } = Twilio;
  let videoRoom;
  let localStream;
  const video = document.getElementById('video');

  // preview screen
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((vid) => {
      video.srcObject = vid;
      localStream = vid;
    });

  const joinRoomButton = document.getElementById('button-join');
  const leaveRoomButton = document.getElementById('button-leave');
  const roomControlsForm = document.getElementById('room-controls-form');
  const preConnectControls = document.getElementById('pre-connect-controls');
  const postConnectControls = document.getElementById('post-connect-controls');
  const participantsDiv = document.getElementById('participants');
  const permissionsHelp = document.getElementById('permissions-help');

  // VIDEO SDK FUNCTIONS
  // Responsible for retrieving the 
  async function getVideoAccessToken(passcode) {
    console.log('Attempting to get Video Access Token')
    try {
      const response = await fetch(`video-token?passcode=${passcode}`)
      const tokenDetails = response.json()
      // console.log(`retrieved video access token ${JSON.stringify(tokenDetails)}`)
      return tokenDetails
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        throw new Error('Invalid passcode');
      } else {
        throw new Error('Unexpected error. Open dev tools for logs');
      }
    }
  }

  const joinRoom = async (event) => {
    event.preventDefault();
    try {
      console.log('Attempting to join room')

      // get access token
      const videoAccessToken = await getVideoAccessToken(getPasscode())
      resetPasscodeInput()
      const { token, roomName } = videoAccessToken;
      // connect to room
      const room = await Video.connect(token, { name: roomName });
      console.log(`Connected to Room ${room.name}`);
      videoRoom = room;

      // Set up logger
      var logger = Video.Logger.getLogger('twilio-video-logger');

      // Listen for logs
      var originalFactory = logger.methodFactory;
      logger.methodFactory = function(methodName, logLevel, loggerName) {
        var method = originalFactory(methodName, logLevel, loggerName);

        return function(datetime, logLevel, component, message, data) {
          method(datetime, logLevel, component, message, data);
          // Send to your own server
        };
      };
      logger.setLevel('debug');

      // Handle participant rendering and events
      room.participants.forEach(participantConnected);
      room.on('participantConnected', participantConnected);

      room.on('participantDisconnected', participantDisconnected);
      room.once('disconnected', (error) =>
        room.participants.forEach(participantDisconnected)
      );
      preConnectControls.style.display = 'none';
      permissionsHelp.style.display = 'none';
      postConnectControls.style.display = 'inline-block';
      participantsDiv.style.display = 'flex';

    } catch (err) {
      // eslint-disable-next-line no-alert
      console.error(err);
    };
  };

  roomControlsForm.onsubmit = joinRoom;
  joinRoomButton.onclick = joinRoom;

  // leave room
  leaveRoomButton.onclick = (event) => {
    videoRoom.disconnect();
    console.log(`Disconnected from Room ${videoRoom.name}`);
    preConnectControls.style.display = 'inline-block';
    permissionsHelp.style.display = 'block';
    postConnectControls.style.display = 'none';
    participantsDiv.style.display = 'none';
    event.preventDefault();
  };
})();