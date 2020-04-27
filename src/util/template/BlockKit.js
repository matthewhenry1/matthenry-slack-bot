const config = require("../../config.js");
const helper = require('../helper.js');

/**

This BlockKit class is leveraged for:
- Initial message from ServiceNow displaying the fields from the record
- Reused when user executes an action from the blockkit
- Leveraged when a MIM is executed

**/

class BlockKit {
  constructor(blockkit_conifg, obj, add_actions, bottom_custom_message, top_custom_messages_obj) {
    this._blockkit_conifg = blockkit_conifg; // object containing configuration
    this._obj = obj; // object containing the values that will be pulled from i.e. {priority: "High", assignment_group: "Application Development"}
    this._add_actions = add_actions; // boolean
    this._bottom_custom_message = bottom_custom_message; // string
    this._top_custom_messages_obj = top_custom_messages_obj; // array of objects label/value pair i.e.{"Title": "stuff", "Description": "bla bla"}

    this._base_url = config.servicenow.base_url;
    this._title = "*<" + this._base_url + "/nav_to.do?uri=" + this._blockkit_conifg.table + ".do?sys_id=" + this._obj.sys_id + "|ServiceNow " + this._blockkit_conifg.table + " " + this._obj.number.toUpperCase() + ">*";
  }

  async build() {
    const result = [];
    console.log("this._top_custom_messages_obj " + JSON.stringify(this._top_custom_messages_obj));
    if (this._top_custom_messages_obj){
      for (const key in this._top_custom_messages_obj){
        console.log("this._top_custom_messages_obj " + "*"+key+"*:"+this._top_custom_messages_obj[key]);
        result.push(await this.process_text_section("*"+key+"*: "+this._top_custom_messages_obj[key]))
      }
    }

    result.push(await this.process_text_section(this._title));
    result.push(await this.process_fields());

    // only one or the other, either the incident is assigned or awaiting assignment
    if (this._add_actions) {
      const actions = await this.process_button_actions();
      console.log('ACTIONS - ' + JSON.stringify(actions));
      if (actions){
          result.push(actions);
      }
    } else if (this._bottom_custom_message) {
      result.push(await this.process_text_section(this._bottom_custom_message));
    }

    // default a divider at the bottom for simple seperation
    result.push(await this.add_divider());

    return result;
  }

  // divider
  async add_divider() {

    return {
      type: "divider"
    };
  }

  // multi-purpose text section
  async process_text_section(text) {

    const result = {};
    result.type = "section";
    result.text = {
      type: "mrkdwn",
      text: text
    };

    return result;
  }

  // takes the labels/values from the scheduler config and retrieves the values from the object
  async process_fields() {

    const fields_template = this._blockkit_conifg.block_kit.fields;

    const result = {};
    result.type = "section";
    result.fields = [];

    for (const template_index in fields_template) {
      const template_value = fields_template[template_index];
      result.fields.push({
        type: "mrkdwn",
        text: "*" + template_index + ":*\n" + await helper.str_dot_walk_obj(this._obj, template_value)
      });
    }

    return result;
  }

  // sets the button actions from the scheduler config
  async process_button_actions() {

    if (!this._blockkit_conifg.block_kit.actions && this._blockkit_conifg.block_kit.actions.length === 0){
      return null;
    }

    const actions_template = this._blockkit_conifg.block_kit.actions;

    const result = {};
    result.type = "actions";
    result.elements = [];

    for (const template_index in actions_template) {
      const template_value = actions_template[template_index];

      result.elements.push({
        type: "button",
        text: {
          type: "plain_text",
          emoji: true,
          text: template_value.text
        },
        style: template_value.style,
        value: template_value.value
      })
    }

    return result;
  }
}

module.exports = BlockKit;
