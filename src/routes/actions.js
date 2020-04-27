const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const Modal = require('../processes/Modal.js');
const BlockActions = require('../processes/BlockActions.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
  extended: true
}));

router.post('/', function(req, res) {
  const payload = JSON.parse(req.body.payload);

  console.log(`slack/actions received body: ${JSON.stringify(payload)}`);

  if (payload.type == "block_actions") {
    console.log(`Received block_actions`);

    const blockactions = new BlockActions();
    blockactions.process_action(payload);

    // send success message back
    res.set('content-type', 'application/json');
    res.status(200).json();

  } else if (payload.type == "view_submission") {
    console.log(`Received view_submission`);

    const modal = new Modal();
    modal.process_submission(payload);

    // send success message back
    res.set('content-type', 'application/json');
    res.status(200).json();
  }
});

module.exports = router;
