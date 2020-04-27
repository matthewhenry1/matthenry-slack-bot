const config = require('../config.js');

const BlockKit = require('../util/template/BlockKit.js');

const Statuspage = require('../util/rest/Statuspage.js');
const statuspage = new Statuspage();

const ServiceNow = require('../util/rest/ServiceNow.js');
const servicenow = new ServiceNow();

const Bot = require('../util/rest/Bot.js');
const bot = new Bot();

class BlockActions {

  async process_action(payload) {

    try {
      if (payload.actions[0].value === "assign") {
        this.process_assignment(payload);
      } else if (payload.actions[0].value === "escalate") {
        bot.post_message(payload['channel']['id'], '<!channel> Escalation for issue above.');
      }
    } catch (error) {
      console.log(`process_action - error: ${error}`);
    }
  }

  async process_assignment(payload) {

    try {
      const url = payload.message.blocks[0].text.text;
      const sys_id = url.split('incident.do?sys_id=')[1].split('|')[0];

      const records = await servicenow.modify_records('incident', sys_id, {
        assigned_to: payload.user.username
      });

      // The retrieval below would ideally be replaced by a hidden field that could assoicate to the JSON configuration
      // Would be best if we could return the Index from the blocks and then we could directly reference below instead of looping.
      let scheduler_config = null;
      for (const index in config.servicenow.scheduler) {
        if (config.servicenow.scheduler[index].table === "incident") {
          scheduler_config = config.servicenow.scheduler[index];
          break;
        }
      }

      if (scheduler_config) {
        const blockkit = new BlockKit(scheduler_config, records.result, false, "Incident is assigned to <@" + payload.user.id + ">");
        const blocks = await blockkit.build();
        console.log(`interaction_response - blocks: ${JSON.stringify(blocks)}`);
        bot.interaction_response(payload['response_url'], '', blocks);
      }

    } catch (error) {
      console.log(`process_assignment - error: ${error}`);
    }
  }
}

module.exports = BlockActions;
