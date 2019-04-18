BaseApp = {

  web3Provider: null,
  webDriver: null,

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      BaseApp.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      BaseApp.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(BaseApp.web3Provider);
    }
    BaseApp.webDriver = web3;
  },

  getProvider: function() {
    if (BaseApp.web3Provider == null) {
      BaseApp.initWeb3();
    }
    return BaseApp.web3Provider;
  },

  getWebDriver: function() {
    if (BaseApp.webDriver == null) {
      BaseApp.initWeb3();
    }
    return BaseApp.webDriver;
  }

};
