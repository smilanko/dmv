SellDonateCarApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	SellDonateCarApp.web3Provider = BaseApp.getProvider();
  	SellDonateCarApp.webDriver = BaseApp.getWebDriver();
  	return SellDonateCarApp.initContract();
  },

  initContract: function() {
    $.getJSON("SellDonateCar.json", function(sellDonateCarContract) {
      SellDonateCarApp.contracts.SellDonateCar = TruffleContract(sellDonateCarContract);
      SellDonateCarApp.contracts.SellDonateCar.setProvider(SellDonateCarApp.web3Provider);
      SellDonateCarApp.listenForEvents();
      return SellDonateCarApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    SellDonateCarApp.contracts.SellDonateCar.deployed().then(function(instance) {
      instance.carSoldDonated({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        SellDonateCarApp.render();
      });
    });
  },

  render: function() {
    var drivingLicenceRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    var sellDonateCarForm = $("#sellDonateCarForm");
    loader.show();
    content.hide();

    SellDonateCarApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        SellDonateCarApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    SellDonateCarApp.contracts.SellDonateCar.deployed().then(function(instance) {
      drivingLicenceRenewalInstance = instance;
      return drivingLicenceRenewalInstance.isCarOwned(SellDonateCarApp.account);
    }).then(function(listingPresent) {
      var carsForSale = $("#carsForSale");
      carsForSale.empty();
      if (listingPresent) {
      	drivingLicenceRenewalInstance.cars(SellDonateCarApp.account).then(function(carDetails) {
        var year = carDetails[0];
        var make = carDetails[1];
        var model = carDetails[2];
  			var carDetailsTemaplte = 	"<tr><td>" + year +  "</td><td>" + make +  "</td><td>" + model + "</td></tr>";
  			carsForSale.html(carDetailsTemaplte);
  			loader.hide();
  			sellDonateCarForm.hide();
  			content.show();
    	});
      } else {
      	sellDonateCarForm.show();
      	loader.show();
      	content.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  sellDonateCar: function() {
    var year = $('#year').val();
    var make = $('#make').val();
    var model = $('#model').val();
    SellDonateCarApp.contracts.SellDonateCar.deployed().then(function(instance) {
      return instance.addCarForSale(year, make, model, { from: SellDonateCarApp.account, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      $("#sellDonateCarForm").hide();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    SellDonateCarApp.configureBase();
  });
});
