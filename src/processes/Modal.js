const config = require('../config.js');

const BlockKit = require('../util/template/BlockKit.js');

const Statuspage = require('../util/rest/Statuspage.js');
const statuspage = new Statuspage();

const ServiceNow = require('../util/rest/ServiceNow.js');
const servicenow = new ServiceNow();

const Bot = require('../util/rest/Bot.js');
const bot = new Bot();

class Modal {

  async process_submission(payload) {
    try {

      // 1.) Parse payload submission
      const obj = await this.parse_blocks(payload);
      console.log(`Received view_submission ${JSON.stringify(obj)}`);

      // 2.) Customer/Client impacting so create a StatusPage
      const status_page_detail = await statuspage.create_incident(obj['Priority'] + ' - ' + obj['Title'], obj['Description']);
      console.log(`Statuspage created: ${JSON.stringify(status_page_detail)}`);
      obj['Statuspage Created'] = status_page_detail.shortlink;

      // 3.) Create a channel with the field passed for Incident Number
      const created_channel = await bot.conversations_create(obj['Incident Number']);
      console.log(`created_channel ${JSON.stringify(created_channel)}`);

      // 4.) Invite the submitter to the newly created channel
      bot.conversations_invite(created_channel.channel.id, payload.user.id);

      const channel_name = obj['Incident Number'].toUpperCase().trim();

      // Formatting channels for later -- begin
      const channels_invited = [];
      for (const index in obj['Channels To Invite']) {
        channels_invited.push("<#" + obj['Channels To Invite'][index] + ">");
      }

      const channels_to_invite = obj['Channels To Invite'];
      channels_to_invite.push(created_channel.channel.id); // let's add the created channel

      delete obj['Channels To Invite'];
      obj['Channels Invited'] = channels_invited.join(', ');
      // Formatting channels for later -- end

      // If this is an incident that is from servicenow it will start with INC
      if (channel_name.startsWith('INC')) {

        // get the records to format a message
        const records = await servicenow.get_records('incident', 'number=' + channel_name);
        if (records) {

          delete obj['Incident Number']; // don't want this displaying on the next template

          const blockkit = new BlockKit(config.mim_modal, records.result[0], false, '*<!channel> ' + obj['Priority'] + ' issue ongoing in <#' + created_channel.channel.id + '>, please join now to assist.*', obj);
          const blocks = await blockkit.build();

          for (const index in channels_to_invite) {
            console.log(`Inviting channels:  ${channels_to_invite[index]}`);
            bot.post_message(channels_to_invite[index], '', blocks);
          }
        }
      } else {
        for (const index in channels_to_invite) {
          console.log(`Inviting channels:  ${channels_to_invite[index]}`);
          bot.post_message(channels_to_invite[index], '*<!channel> ' + obj['Priority'] + ' issue ongoing in <#' + created_channel.channel.id + '>, please join now to assist.*');
        }
      }
    } catch (error) {
      console.log(`process_submission - error: ${error}`);
    }
  }

  // parse the blocks submitted, retrieve their key/values, and set to an object
  async parse_blocks(payload) {

    const obj = {};

    try {
      for (const index in payload.view.blocks) {
        if (payload['view']['blocks'][index]['type'] === "input") {

          const name = payload['view']['blocks'][index]['label']['text'];
          const block_id = payload['view']['blocks'][index]['block_id'];
          const action_id = payload['view']['blocks'][index]['element']['action_id'];

          if (payload['view']['blocks'][index]['element']['type'] === "plain_text_input") {
            const value = payload['view']['state']['values'][block_id][action_id]['value']
            console.log(name + ": " + value);
            obj[name] = value;
          } else if (payload['view']['blocks'][index]['element']['type'] === "static_select") {
            const value = payload['view']['state']['values'][block_id][action_id]['selected_option']['text']['text']
            console.log(name + ": " + value);
            obj[name] = value;
          } else if (payload['view']['blocks'][index]['element']['type'] === "multi_channels_select") {
            const value = payload['view']['state']['values'][block_id][action_id]['selected_channels']
            console.log(name + ": " + value);
            obj[name] = value;
          }
        }
      }
    } catch (error) {
      console.log(`parse_blocks - error: ${error}`);
    }
    return obj;
  }
}

module.exports = Modal;
