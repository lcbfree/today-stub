App({
  globalData: {
    appName: "今日存根",
    version: "0.1.0",
  },

  onLaunch() {
    this.globalData.launchedAt = Date.now();
  },
});
