"use strict";

const utils = require("@iobroker/adapter-core");
const request = require("request");

class Tasmota extends utils.Adapter {

	constructor(options) {
		super({
			...options,
			name: "tasmota",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	async onReady() {
		var DeviceIP = this.config.DeviceIP;

		this.log.info("Device IP: " + this.config.DeviceIP);

		this.log.info("Abfrage gestartet");

		request(
		    {
			url: "http://" + DeviceIP + "/cm?cmnd=status%2010",
			json: true
		    },
		    function(error, response, content) {
			if (!error) {
			    this.log.info("Abfrage ohne Fehler!");
			    //this.log.info(content);
			    //this.log.info("Abfrage ohne Fehler!");
			} else {
			    this.log.error(error);
			}
		    }
		)

		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		await this.setStateAsync("testVariable", { val: true, ack: true });
	}

	onUnload(callback) {
		try {
			callback();
		} catch (e) {
			callback();
		}
	}

	onStateChange(id, state) {
		if (state) {
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			this.log.info(`state ${id} deleted`);
		}
	}

}

if (module.parent) {
	module.exports = (options) => new Tasmota(options);
} else {
	new Tasmota();
}