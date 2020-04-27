module.exports = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "MIM Automation",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Submit",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "divider"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"placeholder": {
					"type": "plain_text",
					"text": "Ex: INC12345 (must be unique for channel name creation)",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Incident Number",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"placeholder": {
					"type": "plain_text",
					"text": "Brief Summary",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Title",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select priority",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "MIM Severity 1",
							"emoji": true
						},
						"value": "sev-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "MIM Severity 2",
							"emoji": true
						},
						"value": "sev-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "MIM Severity 3",
							"emoji": true
						},
						"value": "sev-3"
					}
				]
			},
			"label": {
				"type": "plain_text",
				"text": "Priority",
				"emoji": true
			}
		},
		{
			"type": "input",
			"label": {
				"type": "plain_text",
				"text": "Description",
				"emoji": true
			},
			"element": {
				"type": "plain_text_input",
				"multiline": true,
				"placeholder": {
					"type": "plain_text",
					"text": "Describe the problem",
					"emoji": true
				}
			}
		},
		{
			"type": "input",
			"element": {
				"type": "multi_channels_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a channel",
					"emoji": true
				}
			},
			"label": {
				"type": "plain_text",
				"text": "Channels To Invite",
				"emoji": true
			}
		}
	]
};
