# Twilio Video Conference


![Screenshot 2023-02-24 060808](https://user-images.githubusercontent.com/93249038/221063801-27978baf-3a80-47e2-8c9f-0d1b5e801741.png)

You can fork this code to run a basic 1:1 video chat application. [Check out this blog post for a walkthrough of a serverless version of this app](https://www.twilio.com/blog/build-a-video-app-javascript-twilio-cli-quickly).

Make sure to open the application in a separate tab - the video stream won't work in the preview environment!

## Pre-requisites

### Environment variables

You'll need to set some secrets in Replit to keep the application secure. Remember, you should NEVER publish your account credentials (and, in this case, your conference room secret) where they can be read by others. This app is password protected, so you can leave your credentials loaded, but remember to use a strong passcode to protect your Twilio credits!

You'll need to set the following secrets:

| Variable      | Description                                                                       | Required |
| :------------ | :-------------------------------------------------------------------------------- | :------- |
| `ACCOUNT_SID` | Find in the [console](https://www.twilio.com/console)                             | Yes      |
| `API_KEY`     | Twilio API Key. Create one here (https://www.twilio.com/console/runtime/api-keys) | Yes      |
| `API_SECRET`  | Twilio API Secret corresponding to your API Key                                   | Yes      |
| `ROOM_NAME`   | A room name to identify your video call                                           | Yes      |
| `PASSCODE`    | A passcode to gate your video call                                                | Yes      |

### Function Parameters

`/video-token` expects the following as a query parameter:

| Parameter | Description                                  | Required |
| :-------- | :------------------------------------------- | :------- |
| passcode  | The passcode the user entered on the website | Yes      |
