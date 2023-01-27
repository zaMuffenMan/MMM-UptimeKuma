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

            var iconContainer = document.createElement("span");
            iconContainer.src = service.data;

            serviceContainer.appendChild(iconContainer);
            wrapper.appendChild(pickupContainer);
        })

    return wrapper;
  }

});
