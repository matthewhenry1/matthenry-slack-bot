// core server details
const { createServer } = require('http');
const express = require('express');
const port = process.env.PORT || 3000;

// application routes
const events = require('./routes/events.js');
const actions = require('./routes/actions.js');
const commands = require('./routes/commands.js');

// initiate the express application
const app = express();

// available route urls for the bot
app.use('/slack/events', events);
app.use('/slack/actions', actions);
app.use('/slack/commands', commands);

// Home Page for Heroku App
app.get("/", function (req, res) {
 res.send("<h1 align='center'>Matt's Slack 🤖</h1>");
})

// below is the scheduler responsible for querying ServiceNow on an interval basis
const config = require('./config.js');
const Scheduler = require('./processes/Scheduler.js');
for (const index in config.servicenow.scheduler) {
  const scheduler = new Scheduler(config.servicenow.scheduler[index]);
  scheduler.start();
}

// Initialize a server for the express app
const server = createServer(app);
server.listen(port, () => {
  console.log(`Listening for events on ${server.address().port}`);   // Log a message when the server is ready
})
