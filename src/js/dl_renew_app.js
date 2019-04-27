DrivingLicenseRenewApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	DrivingLicenseRenewApp.web3Provider = BaseApp.getProvider();
  	DrivingLicenseRenewApp.webDriver = BaseApp.getWebDriver();
  	return DrivingLicenseRenewApp.initContract();
  },

  initContract: function() {
    $.getJSON("DrivingLicenseRenew.json", function(vehicleRegistrationRenewal) {
      DrivingLicenseRenewApp.contracts.DrivingLicenseRenew = TruffleContract(vehicleRegistrationRenewal);
      DrivingLicenseRenewApp.contracts.DrivingLicenseRenew.setProvider(DrivingLicenseRenewApp.web3Provider);
      DrivingLicenseRenewApp.listenForEvents();
      return DrivingLicenseRenewApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    DrivingLicenseRenewApp.contracts.DrivingLicenseRenew.deployed().then(function(instance) {
      instance.licenceRenewEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        DrivingLicenseRenewApp.render();
      });
    });
  },

  render: function() {
    var drivingLicenceRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    var reg_block = $("#dl_renew");
    loader.show();
    content.hide();

    DrivingLicenseRenewApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        DrivingLicenseRenewApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    DrivingLicenseRenewApp.contracts.DrivingLicenseRenew.deployed().then(function(instance) {
      drivingLicenceRenewalInstance = instance;
      return drivingLicenceRenewalInstance.isRenewalPresent({ from: DrivingLicenseRenewApp.account });
    }).then(function(renewalPresent) {
      var renewalResults = $("#renewalResults");
      renewalResults.empty();
      if (renewalPresent) {
      	drivingLicenceRenewalInstance.renewals(DrivingLicenseRenewApp.account).then(function(renewalDetail) {
  			var renewalTemplate = 	"<tr><th>" + renewalDetail +  "</td></tr>"
  			renewalResults.html(renewalTemplate);
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

  renewLicence: function() {
    DrivingLicenseRenewApp.contracts.DrivingLicenseRenew.deployed().then(function(instance) {
      return instance.renewLicense({ from: DrivingLicenseRenewApp.account, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      $("#dl_renew").hide();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    DrivingLicenseRenewApp.configureBase();
  });
});
