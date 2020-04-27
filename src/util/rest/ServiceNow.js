const request = require("request-promise");
const config = require("../../config.js");

class ServiceNow {
  constructor() {
    this._base_url = config.servicenow.base_url;
    this._auth_string = "Basic " + new Buffer.from(config.servicenow.username + ":" + config.servicenow.password).toString("base64");
  }

  async get_records(table, filter) {
    try {
      const response = await request({
        uri: this._base_url + "/api/now/table/" + table + "?sysparm_display_value=true&sysparm_query=" + encodeURIComponent(filter),
        method: 'GET',
        headers: {
          "Authorization": this._auth_string
        },
        json: true,
        resolveWithFullResponse: true
      });

      if (response.statusCode >= 200 || response.statusCode <= 299) {
        console.log(`get_records - statusCode returned: ${response.statusCode} with response body: ${JSON.stringify(response.body)}`);
        return response.body;
      } else {
        console.log(`get_records - statusCode returned: ${response.statusCode}`);
        return null;
      }
    } catch (error) {
      console.log(`get_records - error: ${error}`);
      return null;
    }
  }

  // modification to retrieve sys_id based on number
  // ability to modify the record if sys_id = null and number is passed
  async modify_records(table, sys_id, body, number) {

    if (!sys_id && number) {
      sys_id = await this.get_sys_id_from_number(table, number)
    }

    try {
      const response = await request({
        uri: this._base_url + "/api/now/table/" + table + "/" + sys_id + "?sysparm_display_value=true",
        method: 'PUT',
        headers: {
          "Authorization": this._auth_string
        },
        body: body,
        json: true,
        resolveWithFullResponse: true
      });

      if (response.statusCode >= 200 || response.statusCode <= 299) {
        console.log(`modify_records - statusCode returned: ${response.statusCode} with response body: ${JSON.stringify(response.body)}`);
        return response.body;
      } else {
        console.log(`modify_records - statusCode returned: ${response.statusCode}`);
        return null;
      }
    } catch (error) {
      console.log(`modify_records - error: ${error}`);
      return null;
    }
  }

  // number is unique in servicenow, so will always return associated incident
  async get_sys_id_from_number(table, number) {
    try {
      const records = await this.get_records(table, 'number=' + number);
      return records.result[0].sys_id;
    } catch (error) {
      console.log(`get_records - error: ${error}`);
      return null;
    }
  }

}

module.exports = ServiceNow;
