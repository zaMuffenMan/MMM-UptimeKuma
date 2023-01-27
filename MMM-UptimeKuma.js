Module.register('MMM-UptimeKuma', {

  // Default values
  defaults: {
    baseUrl: "",
    services: []
  },

  // Define stylesheet
  getStyles: function () {
      return ["MMM-UptimeKuma.css"];
  },

  start: function () {
    Log.info('Starting module: ' + this.name);
      this.sendSocketNotification('MMM-UPTIMEKUMA-CONFIG', this.config);
      this.serviceResults = [];
      this.sendSocketNotification('MMM-UPTIMEKUMA-GET', this.config);
  },

    getDom: function () {
        var wrapper = document.createElement("div");

        var self = this;

      if (self.serviceResults.length == 0) {
          wrapper.innerHTML = this.translate("LOADING");
          wrapper.className = "dimmed light small";
          return wrapper;
      }

        self.serviceResults.forEach(service => {
            var serviceContainer = document.createElement("div");
            serviceContainer.classList.add("service-container");

            var labelContainer = document.createElement("span");
            labelContainer.classList.add("service-label");
            labelContainer.innerHTML = service.label;

            serviceContainer.appendChild(labelContainer);

            var iconContainer = document.createElement("img");
            iconContainer.src = service.data;

            serviceContainer.appendChild(iconContainer);
            wrapper.appendChild(serviceContainer);
        })

    return wrapper;
    },

    sendSocketNotification: function (notification, payload) {
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
        this.getServices(payload);
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
