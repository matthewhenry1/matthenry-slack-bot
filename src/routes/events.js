const express = require('express');
const router = express.Router();
const config = require('../config.js');

// for message events
const { createEventAdapter } = require('@slack/events-api');
const slackEvents = createEventAdapter(config.slack.slack_signing_secret);

router.use('/', slackEvents.requestListener());

slackEvents.on('app_mention', (event) => {
  console.log('Received an app_mention event: ' + JSON.stringify(event));
});

module.exports = router;
