var PracticeExam = artifacts.require("PracticeExam");

contract("PracticeExam", function(accounts){
	
	var purchaseExamInstance;
	var oldRecepientBalance;
	var newRecepientBalance;

	var oldSenderBalance;
	var newSenderBalance;

	it("exam purchased", function() {
		return PracticeExam.deployed().then(function(instance) {
			purchaseExamInstance = instance;
			return purchaseExamInstance.isExamPurchased({ from : accounts[0] });
		}).then(function(purcahsed) {
			assert.isFalse(purcahsed, "the exam was not purcahsed");
			return web3.eth.getBalance(accounts[1]);
		}).then(function(receivedBalance) {
			oldRecepientBalance = web3.utils.fromWei(receivedBalance);
			return purchaseExamInstance.purchaseExam(accounts[1], { from : accounts[0], value: 1000000000000000000 });
		}).then(function(sendReceipt) {
			return web3.eth.getBalance(accounts[1]);
		}).then(function(receivedBalance) {
			newRecepientBalance = web3.utils.fromWei(receivedBalance);
			expectedIncrease = new web3.utils.BN(oldRecepientBalance).add(new web3.utils.BN(web3.utils.fromWei('1000000000000000000'))).toString();
			assert.equal(expectedIncrease, newRecepientBalance, "the recepient got money");
			return purchaseExamInstance.isExamPurchased({ from : accounts[0] });
		}).then(function(purchaseConfimration){
			assert.isTrue(purchaseConfimration, "the sender gained purchase rights");
			return purchaseExamInstance.questions(accounts[0]);
		}).then(function(practiceQuesiton) {
			assert.equal("What color is the stop sign?", practiceQuesiton[0], "question match");
			assert.equal("Red", practiceQuesiton[1], "answer match");
		});
	});

});