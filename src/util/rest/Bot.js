const {WebClient} = require("@slack/web-api");
const config = require("../../config.js");
const web = new WebClient(config.slack.slack_token);
const modal = require("../template/mim_modal.js");
const request = require("request-promise");

class Bot {

  // https://api.slack.com/methods/chat.postMessage
  async post_message(channel, text, blocks) {
    try {
      const payload = {
        channel: channel,
        text: text
      };

      if (blocks) {
        payload.blocks = blocks;
      }

      const response = await web.chat.postMessage(payload);
      console.log("message: " + JSON.stringify(response));

    } catch (error) {
      console.log(error);
    }
  }

  async conversations_list() {
    try {
      const response = await web.conversations.list();
      console.log("conversations_list: " + JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async conversations_create(name) {
    try {
      const response = await web.conversations.create({
        name: name.toLowerCase()
      });
      console.log("conversations_create: " + JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // https://api.slack.com/methods/conversations.invite
  async conversations_invite(channel_id, users) {
    try {
      const response = await web.conversations.invite({
        channel: channel_id,
        users: users
      });
      console.log("conversations_invite: " + JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async views_open_modal(trigger_id) {
    try {
      const response = await web.views.open({
        trigger_id: trigger_id,
        view: modal
      });

      console.log("views_open: " + JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async interaction_response(url, text, blocks) {
    try {
      const body = {
        "replace_original": "true",
        "text": text,
        "blocks": blocks
      }

      const response = await request({
        uri: url,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: body,
        json: true,
        resolveWithFullResponse: true
      });

      if (response.statusCode >= 200 || response.statusCode <= 299) {
        console.log(`interaction_response - statusCode returned: ${response.statusCode} with response body: ${JSON.stringify(response.body)}`);
        return response.body;
      } else {
        console.log(`interaction_response - statusCode returned: ${response.statusCode}`);
        return null;
      }
    } catch (error) {
      console.log(`interaction_response - error: ${error}`);
      return null;
    }
  }
}

module.exports = Bot;
