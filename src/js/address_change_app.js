ChangeAddressApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	ChangeAddressApp.web3Provider = BaseApp.getProvider();
  	ChangeAddressApp.webDriver = BaseApp.getWebDriver();
  	return ChangeAddressApp.initContract();
  },

  initContract: function() {
    $.getJSON("AddressChange.json", function(addressChange) {
      ChangeAddressApp.contracts.AddressChange = TruffleContract(addressChange);
      ChangeAddressApp.contracts.AddressChange.setProvider(ChangeAddressApp.web3Provider);
      ChangeAddressApp.listenForEvents();
      return ChangeAddressApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    ChangeAddressApp.contracts.AddressChange.deployed().then(function(instance) {
      instance.addressUpdateEvent({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        ChangeAddressApp.render();
      });
    });
  },

  render: function() {
    var changeAddressInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    ChangeAddressApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        ChangeAddressApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    ChangeAddressApp.contracts.AddressChange.deployed().then(function(instance) {
      changeAddressInstance = instance;
      return changeAddressInstance.isAddressPresent({ from: ChangeAddressApp.account });
    }).then(function(addressPresent) {
      var chngeAddrResults = $("#addressResults");
      chngeAddrResults.empty();
      if (addressPresent) {
      	changeAddressInstance.addresses(ChangeAddressApp.account).then(function(registration) {
  			var street = registration[0];
  			var city = registration[1];
  			var state = registration[2];
  			var zip = registration[3];
  			var addrTemplate = 	"<tr><th>" + street + "</th><td>" + city +  "</td><td>" + state + "</th><td>" + zip +  "</td></tr>"
  			chngeAddrResults.html(addrTemplate);
  			loader.hide();
  			content.show();
      	});
      } else {
      	loader.show();
      	content.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  changeAddress: function() {
    var street = $('#street').val();
    var city = $('#city').val();
    var state = $('#state').val();
    var zip = $('#zip').val();
    ChangeAddressApp.contracts.AddressChange.deployed().then(function(instance) {
      return instance.changeAddress(street, city, state, zip, { from: ChangeAddressApp.account, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    ChangeAddressApp.configureBase();
  });
});
