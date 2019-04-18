VehicleRegistrationApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	VehicleRegistrationApp.web3Provider = BaseApp.getProvider();
  	VehicleRegistrationApp.webDriver = BaseApp.getWebDriver();
  	return VehicleRegistrationApp.initContract();
  },

  initContract: function() {
    $.getJSON("VehicleRegistrationRenewal.json", function(vehicleRegistrationRenewal) {
      VehicleRegistrationApp.contracts.VehicleRegistrationRenewal = TruffleContract(vehicleRegistrationRenewal);
      VehicleRegistrationApp.contracts.VehicleRegistrationRenewal.setProvider(VehicleRegistrationApp.web3Provider);
      VehicleRegistrationApp.listenForEvents();
      return VehicleRegistrationApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    VehicleRegistrationApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      instance.registrationEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        VehicleRegistrationApp.render();
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

    VehicleRegistrationApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        VehicleRegistrationApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    VehicleRegistrationApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      vehicleRegistrationRenewalInstance = instance;
      return vehicleRegistrationRenewalInstance.isRegistrationPresent({ from: VehicleRegistrationApp.account });
    }).then(function(registrationPresent) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();
      if (registrationPresent) {
      	vehicleRegistrationRenewalInstance.registrations(VehicleRegistrationApp.account).then(function(registration) {
			var vin = registration[0];
			var year = registration[1];
			var model = registration[2];
			var expiringYear = registration[3];
			var registrationTemplate = 	"<tr><th>" + vin + "</th><td>" + year +  "</td><td>" + model + "</th><td>" + expiringYear +  "</td></tr>"
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
    VehicleRegistrationApp.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      return instance.processRegistration(vin, year, model, { from: VehicleRegistrationApp.account, gas:3000000 });
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
    VehicleRegistrationApp.configureBase();
  });
});
