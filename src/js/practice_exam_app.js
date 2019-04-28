PracticeExamApp = {

  web3Provider: null,
  webDriver: null,
  contracts: {},
  account: '0x0',

  configureBase: function() {
  	PracticeExamApp.web3Provider = BaseApp.getProvider();
  	PracticeExamApp.webDriver = BaseApp.getWebDriver();
  	return PracticeExamApp.initContract();
  },

  initContract: function() {
    $.getJSON("PracticeExam.json", function(vehicleRegistrationRenewal) {
      PracticeExamApp.contracts.PracticeExam = TruffleContract(vehicleRegistrationRenewal);
      PracticeExamApp.contracts.PracticeExam.setProvider(PracticeExamApp.web3Provider);
      PracticeExamApp.listenForEvents();
      return PracticeExamApp.render();
    });

  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    PracticeExamApp.contracts.PracticeExam.deployed().then(function(instance) {
      instance.practiceQuestionsPurchased({}, {
        fromBlock: 'latest'
      }).watch(function(error, event) {
        PracticeExamApp.render();
      });
    });
  },

  render: function() {
    var drivingLicenceRenewalInstance;
    var loader = $("#loader");
    var content = $("#content");
    var purchaseExamForm = $("#purchaseExam");
    loader.show();
    content.hide();

    PracticeExamApp.webDriver.eth.getCoinbase(function(err, account) {
      if (err === null) {
        PracticeExamApp.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    PracticeExamApp.contracts.PracticeExam.deployed().then(function(instance) {
      drivingLicenceRenewalInstance = instance;
      return drivingLicenceRenewalInstance.isExamPurchased({ from: PracticeExamApp.account });
    }).then(function(purchasePresent) {
      var purchaseResult = $("#purchaseResult");
      purchaseResult.empty();
      if (purchasePresent) {
      	drivingLicenceRenewalInstance.questions(PracticeExamApp.account).then(function(qAndA) {
        var question = qAndA[0];
        var answer = qAndA[1];
  			var qAndATemplate = 	"<tr><th>" + question +  "</td></tr>" + "<tr><th>" + answer +  "</td></tr>"
  			purchaseResult.html(qAndATemplate);
  			loader.hide();
  			purchaseExamForm.hide();
  			content.show();
    	});
      } else {
      	purchaseExamForm.show();
      	loader.show();
      	content.hide();
      }
    }).catch(function(error) {
      console.warn(error);
    });
  },

  purchaseExam: function() {
    PracticeExamApp.contracts.PracticeExam.deployed().then(function(instance) {
      return instance.purchaseExam('0xf351450ee62d96d9e1471d7b18121180badb30e5', { from: PracticeExamApp.account, value: 1000000000000000000, gas:3000000 });
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
      $("#purchaseExam").hide();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    PracticeExamApp.configureBase();
  });
});
