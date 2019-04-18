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
      return vehicleRegistrationRenewalInstance.registrations();
    }).then(function(registrations) {
      var registrationResults = $("#registrationResults");
      registrationResults.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        vehicleRegistrationRenewalInstance.candidates(i).then(function(registration) {
          var vin = registration[0];
          var year = registration[1];
          var model = registration[2];
          var ssn = registration[3];
          var firstName = registration[4];
          var lastName = registration[5];

          // Render registration Result
          var registrationTemplate = 	"<tr><th>" + vin + "</th><td>" + year +  "</td><td>" + model + "</th><td>" + ssn +  "</th><td>" + firstName +  "</th><td>" + lastName +  "</td></tr>"
          registrationResults.append(registrationTemplate);

        });
      }
      return vehicleRegistrationRenewalInstance.registrations(App.account);
    }).then(function(hasRegistered) {
      // Do not allow a user to vote
      if(hasRegistered) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  registerVehicle: function() {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Election.deployed().then(function(instance) {
      return instance.vote(candidateId, { from: App.account });
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
