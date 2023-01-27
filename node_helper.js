var NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node_helper for module: " + this.name);
    this.schedule = null;
  },

  socketNotificationReceived: function (notification, payload) {
      var self = this;

      switch (notification) {
          case 'MMM-UPTIMEKUMA-CONFIG':
              self.handleConfigNotification(payload);
          case 'MMM-UPTIMEKUMA-GET':
              self.handleGetNotification(payload);
      }
    },

    handleConfigNotification: function (payload) {
        var self = this;
        self.config = payload;
    },

    handleGetNotification: function (payload) {
        getServices(payload);
    },

    // Get data from the services
    getServices: function (config) {
        var self = this;

        clearTimeout(this.timer);
        self.timer = null;

        self.serviceResults = [];
        config.services.forEach(service => {
            var obj = {};
            obj['data'] = config.baseUrl + '/api/badge/' + service.id + '/status';
            obj['label'] = service.label;
            self.serviceResults.push(obj);
        });

        // Set check times
        self.timer = setTimeout(function () {
            self.handleGetNotification(self.config)
        }, 60 * 1000); // update once a minute
    },
});
