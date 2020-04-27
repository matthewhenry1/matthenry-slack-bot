const request = require("request-promise");
const config = require("../../config.js");

class Statuspage {
  constructor() {
    this._base_url = config.statuspage.base_url;
    this._page_id = config.statuspage.page_id;
    this._api_key = config.statuspage.api_key;
  }

  async create_incident(name, message) {
    try {
      // URL: https://api.statuspage.io/v1/pages/rk1p00wbytzp/incidents.json?api_key=72476929-c224-4408-bfc0-740a1b667445

      const body = {
        incident: {
          name: name,
          message: message
        }
      }

      const response = await request({
        uri: this._base_url + this._page_id+ "/incidents.json?api_key="+this._api_key,
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: body,
        json: true,
        resolveWithFullResponse: true
      });

      if (response.statusCode >= 200 || response.statusCode <= 299) {
        console.log(`create_incident - statusCode returned: ${response.statusCode} with response body: ${JSON.stringify(response.body)}`);
        return response.body;
      } else {
        console.log(`create_incident - statusCode returned: ${response.statusCode}`);
        return null;
      }
    } catch (error) {
      console.log(`create_incident - error: ${error}`);
      return null;
    }
  }
}

module.exports = Statuspage;
