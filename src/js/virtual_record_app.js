VirtualRecordApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	VirtualRecordApp.web3Provider = BaseApp.getProvider();
  	VirtualRecordApp.webDriver = BaseApp.getWebDriver();
  	return VirtualRecordApp.initContract();
  },

  initContract: function() {
    $.getJSON("VirtualRecord.json", function(virtualRecordContract) {
      VirtualRecordApp.contracts.VirtualRecord = TruffleContract(virtualRecordContract);
      VirtualRecordApp.contracts.VirtualRecord.setProvider(VirtualRecordApp.web3Provider);
      VirtualRecordApp.listenForEvents();
      return VirtualRecordApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    VirtualRecordApp.contracts.VirtualRecord.deployed().then(function(instance) {
      instance.recordUpdated({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        VirtualRecordApp.render();
      });
    });
  },

  render: function() {
    var drivingLicenceRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    loader.show();
    content.hide();

    VirtualRecordApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        VirtualRecordApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    VirtualRecordApp.contracts.VirtualRecord.deployed().then(function(instance) {
      drivingLicenceRenewalInstance = instance;
      return drivingLicenceRenewalInstance.isExistsVirtualRecord(VirtualRecordApp.account);
    }).then(function(citationsPresent) {
      var virtualRecord = $("#virtualRecord");
      virtualRecord.empty();
      if (citationsPresent) {
      	drivingLicenceRenewalInstance.virtualRecord(VirtualRecordApp.account).then(function(record) {
        var numTix = record[0];
        var numAcc = record[1];
        var officer = record[2];
  			var recordTemplate = 	"<tr><td>" + numTix + "</td><td>" + numAcc +  "</td><td>" + officer +  "</td></tr>"
  			virtualRecord.html(recordTemplate);
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

  addVirtualRecord: function() {
    var isTicket = $('#isTicket').val();
    var isAccident = $('#isAccident').val();
    VirtualRecordApp.contracts.VirtualRecord.deployed().then(function(instance) {
      return instance.addVirtualRecord('0x15b7e90c97511b7cb5cc9516f0542d0da66ecd84', isAccident, isTicket , { from: VirtualRecordApp.account, gas:3000000 });
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
    VirtualRecordApp.configureBase();
  });
});
