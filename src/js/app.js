App = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	App.web3Provider = BaseApp.getProvider();
  	App.webDriver = BaseApp.getWebDriver();
  	return App.initContract();
  },

  initContract: function() {
    $.getJSON("VehicleRegistrationRenewal.json", function(vehicleRegistrationRenewal) {
      App.contracts.VehicleRegistrationRenewal = TruffleContract(vehicleRegistrationRenewal);
      App.contracts.VehicleRegistrationRenewal.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      instance.registrationEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        App.render();
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

    App.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    App.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      vehicleRegistrationRenewalInstance = instance;
      return vehicleRegistrationRenewalInstance.isRegistrationPresent({ from: App.account });
    }).then(function(registrationPresent) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();
      if (registrationPresent) {
      	vehicleRegistrationRenewalInstance.registrations(App.account).then(function(registration) {
			var vin = registration[0];
			var year = registration[1];
			var model = registration[2];
			var firstName = registration[3];
			var lastName = registration[4];
			var expiringYear = registration[5];
			var registrationTemplate = 	"<tr><th>" + vin + "</th><td>" + year +  "</td><td>" + model + "</th><td>" + firstName +  "</th><td>" + lastName + "</th><td>" + expiringYear +  "</td></tr>"
			registrationResults.append(registrationTemplate);
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

  registerVehicle: function() {
    var vin = $('#vin').val();
    var year = $('#year').val();
    var model = $('#model').val();
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    App.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      return instance.processRegistration(vin, year, model, firstName, lastName, { from: App.account, gas:3000000 });
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
    App.configureBase();
  });
});
