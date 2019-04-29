TitlingApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	TitlingApp.web3Provider = BaseApp.getProvider();
  	TitlingApp.webDriver = BaseApp.getWebDriver();
  	return TitlingApp.initContract();
  },

  initContract: function() {
    $.getJSON("Titling.json", function(titlingContract) {
      TitlingApp.contracts.Titling = TruffleContract(titlingContract);
      TitlingApp.contracts.Titling.setProvider(TitlingApp.web3Provider);
      TitlingApp.listenForEvents();
      return TitlingApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    TitlingApp.contracts.Titling.deployed().then(function(instance) {
      instance.carTitled({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        TitlingApp.render();
      });
    });
  },

  render: function() {
    var TitlingInstance;
    var loader = $("#loader");
    var content = $("#content");
    var reg_block = $("#add_registration");
    loader.show();
    content.hide();

    TitlingApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        TitlingApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    TitlingApp.contracts.Titling.deployed().then(function(instance) {
      TitlingInstance = instance;
      return TitlingInstance.isCarTitled({ from: TitlingApp.account });
    }).then(function(registrationPresent) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();
      if (registrationPresent) {
      	TitlingInstance.carTitles(TitlingApp.account).then(function(registration) {
  			var vin = registration;
  			var registrationTemplate = 	"<tr><th>" + vin + "</th></tr>";
  			registrationResults.html(registrationTemplate);
  			loader.hide();
  			reg_block.hide();
  			content.show();
    	});
      } else {
      	reg_block.show();
      	loader.show();
      	content.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  titleCar: function() {
    var vin = $('#vin').val();
    TitlingApp.contracts.Titling.deployed().then(function(instance) {
      return instance.titleCar(vin, { from: TitlingApp.account, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      $("#add_registration").hide();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    TitlingApp.configureBase();
  });
});
