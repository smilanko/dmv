VehicleSoldTradedApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	VehicleSoldTradedApp.web3Provider = BaseApp.getProvider();
  	VehicleSoldTradedApp.webDriver = BaseApp.getWebDriver();
  	return VehicleSoldTradedApp.initContract();
  },

  initContract: function() {
    $.getJSON("VehicleRegistrationRenewal.json", function(vehicleRegistrationRenewal) {
      VehicleSoldTradedApp.contracts.VehicleRegistrationRenewal = TruffleContract(vehicleRegistrationRenewal);
      VehicleSoldTradedApp.contracts.VehicleRegistrationRenewal.setProvider(VehicleSoldTradedApp.web3Provider);
      VehicleSoldTradedApp.listenForEvents();
      return VehicleSoldTradedApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    VehicleSoldTradedApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      instance.registrationEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        VehicleSoldTradedApp.render();
      });
    });
  },

  render: function() {
    var vehicleRegistrationRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    var reg_block = $("#add_registration");
    loader.show();
    content.hide();

    VehicleSoldTradedApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        VehicleSoldTradedApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    VehicleSoldTradedApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      vehicleRegistrationRenewalInstance = instance;
      return vehicleRegistrationRenewalInstance.isRegistrationPresent({ from: VehicleSoldTradedApp.account });
    }).then(function(registrationPresent) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();
      if (registrationPresent) {
      	vehicleRegistrationRenewalInstance.registrations(VehicleSoldTradedApp.account).then(function(registration) {
  			var vin = registration[0];
  			var year = registration[1];
  			var model = registration[2];
  			var expiringYear = registration[3];
  			var registrationTemplate = 	"<tr><th>" + vin + "</th><td>" + year +  "</td><td>" + model + "</th><td>" + expiringYear +  "</td></tr>"
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

  reportSoldTraded: function() {
    var vin = $('#vin').val();
    var year = $('#year').val();
    var model = $('#model').val();
    VehicleSoldTradedApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      return instance.reportSoldTraded('0x24873b56e520e905a263d7546d7d26165824dd0d', { from: VehicleSoldTradedApp.account, gas:3000000 });
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
    VehicleSoldTradedApp.configureBase();
  });
});
