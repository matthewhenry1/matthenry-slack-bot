const _ = require('underscore');

const Bot = require('../util/rest/Bot.js');
const bot = new Bot();

const ServiceNow = require('../util/rest/ServiceNow.js');
const servicenow = new ServiceNow();

const BlockKit = require('../util/template/BlockKit.js');

const config = require('../config.js');
const helper = require('../util/helper.js');

class Scheduler {
  constructor(scheduler_config) {
    this._scheduler_config = scheduler_config;
  }

  start() {
    // only execute the interval scheduler if the
    if (this._scheduler_config.enable) {
      console.log(`Scheduler is configured`);
      setInterval(this.execute, this._scheduler_config.interval, this._scheduler_config);
    } else {
      console.log(`Scheduler not configured`);
    }
  }

  async execute(scheduler_config) {
    try {
      console.log(`scheduler_config: ${JSON.stringify(scheduler_config)}`);

      const records = await servicenow.get_records(scheduler_config.table, scheduler_config.filter);
      console.log(`Retrieved ${JSON.stringify(scheduler_config)} number of records.`);

      // if no servicenow records returned let's exit the execution
      if (records.result.length === 0) {
        console.log(`No matching records`);
        return;
      }

      const convos = await bot.conversations_list();
      const channel_names = _.pluck(convos.channels, 'name');

      console.log(`channel_names: ' + ${channel_names}`);

      for (const index in records.result) {

        const channel_name = (await helper.str_dot_walk_obj(records.result[index], scheduler_config.channel_name)).toString().toLowerCase().split(' ').join('_').substring(0, config.channel_name_max_length);
        console.log('channel_name - ' + channel_name);

        let channel_create = null;
        if (!_.contains(channel_names, channel_name)) {
          channel_create = await bot.conversations_create(channel_name);
        }

        // only post the message if the channel already exists or if the channel was successfully created
        if (channel_create || _.contains(channel_names, channel_name)) {
          const blockkit = new BlockKit(scheduler_config, records.result[index], true);
          const blocks = await blockkit.build();
          bot.post_message('#' + channel_name, '', blocks);

          // let's modify the servicenow record to ensure that the record doesn't get picked up again and notifies the channel. i.e. suppression mechanism
          if (scheduler_config.modify.enable) {
            const sys_id = records.result[index].sys_id;
            servicenow.modify_records(scheduler_config.table, sys_id, scheduler_config.modify.fields);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Scheduler;
