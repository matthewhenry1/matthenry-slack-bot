const config = {
  slack: {
    slack_token: "xoxb-965363681826-977705172708-cLscy4z0y8AzK8pxr8NHp7W6",
    slack_signing_secret: "a9d279436911becbe0cc40e01f3270f2",
    channel_name_max_length: 80
  },
  statuspage: {
    // https://matthenrybot.statuspage.io -> to view incident
    base_url: 'https://api.statuspage.io/v1/pages/',
    page_id: 'rk1p00wbytzp',
    api_key: '72476929-c224-4408-bfc0-740a1b667445'
  },
  servicenow: {
    base_url: "https://dev93772.service-now.com",
    username: "api",
    password: "Password!1",

    /**
    - The scheduler below is developed in an array so that it can be repurposed for other tables
    - Caveats:
      - If additional tables are required, do not add any actions for the new tables. Enhancements required to support additional block actions.
      - Only one Incident table is supported at the moment, need to develop a better solution for associating the config -> process. Hidden data in the block actions might be valuable.
    **/

    scheduler: [{
      enable: true,
      interval: 30000,
      number_prefix: "INC",
      table: "incident",
      filter: "active=true^priority<=2^state=1^notify=1",
      channel_name: "assignment_group.display_value",
      modify: {
        enable: true,
        fields: {
          notify: "2"
        }
      },
      block_kit: {
        fields: { // cannot contain more than 10 fields
          "Incident Number": "number",
          Service: "business_service.display_value",
          Category: "category",
          "Configuration Item": "cmdb_ci.display_value",
          State: "state",
          Impact: "impact",
          Urgency: "urgency",
          Priority: "priority",
          "Assignment Group": "assignment_group.display_value",
          "Short Description": "short_description"
        },
        actions: [{
          text: "Assign To Me",
          style: "primary",
          value: "assign",
        }, {
          text: "Escalate",
          style: "danger",
          value: "escalate",
        }]
      }
    }]
  },
  mim_modal: {
    table: "incident",
    block_kit: {
      fields: { // cannot contain more than 10 fields
        "Incident Number": "number",
        Service: "business_service.display_value",
        Category: "category",
        "Configuration Item": "cmdb_ci.display_value",
        State: "state",
        Impact: "impact",
        Urgency: "urgency",
        Priority: "priority",
        "Assignment Group": "assignment_group.display_value",
        "Short Description": "short_description"
      }
    }
  }
};

module.exports = config;
