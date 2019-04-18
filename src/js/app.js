App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("VehicleRegistrationRenewal.json", function(vehicleRegistrationRenewal) {
    	console.log("### loaded vehicle registratin renewal");
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
        console.log("event triggered", event)
        App.render();
      });
    });
  },

  render: function() {
    var vehicleRegistrationRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.VehicleRegistrationRenewal.deployed().then(function(instance) {
      vehicleRegistrationRenewalInstance = instance;
      return vehicleRegistrationRenewalInstance.registrationCount();
    }).then(function(registrationCount) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();

      for (var i = 1; i <= registrationCount; i++) {
        vehicleRegistrationRenewalInstance.registrations(i).then(function(registration) {
          var vin = registration[0];
          var year = registration[1];
          var model = registration[2];
          var owner_pk = registration[3];
          var firstName = registration[4];
          var lastName = registration[5];

          var registrationTemplate = 	"<tr><th>" + vin + "</th><td>" + year +  "</td><td>" + model + "</th><td>" + owner_pk + "</th><td>" + firstName +  "</th><td>" + lastName +  "</td></tr>"
          registrationResults.append(registrationTemplate);

        });
      }
      console.log("### we are gonna check to see if registered with :: " + App.account);
      return vehicleRegistrationRenewalInstance.isRegistrationPresent(App.account);
    }).then(function(isRegistrationPresent) {
      // Do not allow a user to vote
      if(isRegistrationPresent) {
        $('form').hide();
      }
      loader.hide();
      content.show();
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
      return instance.processRegistration(vin, year, model, { from: App.account }, firstName, lastName);
    }).then(function(result) {
      // Wait for votes to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
