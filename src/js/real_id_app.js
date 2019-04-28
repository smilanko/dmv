RealIdApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	RealIdApp.web3Provider = BaseApp.getProvider();
  	RealIdApp.webDriver = BaseApp.getWebDriver();
  	return RealIdApp.initContract();
  },

  initContract: function() {
    $.getJSON("ReadLid.json", function(realIdContract) {
      RealIdApp.contracts.ReadLid = TruffleContract(realIdContract);
      RealIdApp.contracts.ReadLid.setProvider(RealIdApp.web3Provider);
      RealIdApp.listenForEvents();
      return RealIdApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    RealIdApp.contracts.ReadLid.deployed().then(function(instance) {
      instance.purchasedRealId({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        RealIdApp.render();
      });
    });
  },

  render: function() {
    var realIdPurchaseInstance;
    var loader = $("#loader");
    var content = $("#content");
    var purchaseRealIdForm = $("#purchaseRealId");
    loader.show();
    content.hide();

    RealIdApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        RealIdApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    RealIdApp.contracts.ReadLid.deployed().then(function(instance) {
      realIdPurchaseInstance = instance;
      return realIdPurchaseInstance.isPurchasedReadId({ from: RealIdApp.account });
    }).then(function(purchasePresent) {
      var purchaseResult = $("#purchaseResult");
      purchaseResult.empty();
      if (purchasePresent) {
      	realIdPurchaseInstance.realIds(RealIdApp.account).then(function(realIdPurchase) {
        var canVote = realIdPurchase[0];
        var canDrive = realIdPurchase[1];
        var canFly = realIdPurchase[2];
        var isFederal = realIdPurchase[3];
        var realIdTemplate =  "<tr><th>" + canVote + "</th><td>" + canDrive +  "</td><td>" + canFly + "</th><td>" + isFederal +  "</td></tr>"
  			purchaseResult.html(realIdTemplate);
  			loader.hide();
  			purchaseRealIdForm.hide();
  			content.show();
    	});
      } else {
      	purchaseRealIdForm.show();
      	loader.show();
      	content.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  purchaseRealId: function() {
    var vote = $('#vote').val();
    var drive = $('#drive').val();
    var fly = $('#fly').val();
    var federal = $('#federal').val();
    RealIdApp.contracts.ReadLid.deployed().then(function(instance) {
      return instance.purchaseRealId('0xf351450ee62d96d9e1471d7b18121180badb30e5', vote, drive, fly, federal, { from: RealIdApp.account, value: 1000000000000000000, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      $("#purchaseRealId").hide();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    RealIdApp.configureBase();
  });
});
