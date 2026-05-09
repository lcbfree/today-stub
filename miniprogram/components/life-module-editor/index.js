Component({
  properties: {
    definitions: {
      type: Array,
      value: [],
    },
    modules: {
      type: Array,
      value: [],
    },
  },

  methods: {
    emitModules(modules) {
      this.triggerEvent("change", {
        value: modules,
      });
    },

    toggleModule(event) {
      const moduleId = event.currentTarget.dataset.id;
      const modules = (this.properties.modules || []).map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          enabled: !module.enabled,
        };
      });

      this.emitModules(modules);
    },

    updateValue(event) {
      const moduleId = event.currentTarget.dataset.id;
      const value = event.detail.value;
      const modules = (this.properties.modules || []).map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          value,
        };
      });

      this.emitModules(modules);
    },
  },
});
