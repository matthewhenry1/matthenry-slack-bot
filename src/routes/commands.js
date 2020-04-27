const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Bot = require('../util/rest/Bot.js');
const bot = new Bot();

const ServiceNow = require('../util/rest/ServiceNow.js');
const servicenow = new ServiceNow();

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
  extended: true
}))

/**
/scribe POST - provides the ability to scribe to servicenow
**/
router.post('/scribe', function(req, res) {
  let payload = req.body;

  console.log(`slack/commands/scribe received body: ${JSON.stringify(payload)}`);

  const channel_name = payload.channel_name.toUpperCase().trim();

  // if the channel name starts with INC then we treat it like it's a ServiceNow record, all incident records start with INC
  if (channel_name.startsWith('INC')) {
    servicenow.modify_records('incident', null, {
      work_notes: "[SCRIBE] - "+payload.text
    }, channel_name);
  }

  res.set('content-type', 'application/json');
  res.status(200).json({
    request: "success"
  });
});

/**
/mim POST - provides the ability to initiate mim modal
**/
router.post('/mim', function(req, res) {
  let payload = req.body;

  console.log(`slack/commands/mim received body: ${JSON.stringify(payload)}`);
  bot.views_open_modal(payload.trigger_id);

  res.set('content-type', 'application/json');
  res.status(200).json();
});

module.exports = router;
