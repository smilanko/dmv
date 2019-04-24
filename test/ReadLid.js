var ReadLid = artifacts.require("ReadLid");

contract("ReadLid", function(accounts){
	
	var purchasedRealIdInstance;
	var oldRecepientBalance;
	var newRecepientBalance;

	var oldSenderBalance;
	var newSenderBalance;

	it("real id purchased", function() {
		return ReadLid.deployed().then(function(instance) {
			purchasedRealIdInstance = instance;
			return purchasedRealIdInstance.isPurchasedReadId({ from : accounts[0] });
		}).then(function(purcahsed) {
			assert.isFalse(purcahsed, "real id was not purcahsed");
			return web3.eth.getBalance(accounts[1]);
		}).then(function(receivedBalance) {
			oldRecepientBalance = web3.utils.fromWei(receivedBalance);
			return purchasedRealIdInstance.purchaseRealId(accounts[1], true, true, true, true, { from : accounts[0], value: 1000000000000000000 });
		}).then(function(sendReceipt) {
			return web3.eth.getBalance(accounts[1]);
		}).then(function(receivedBalance) {
			newRecepientBalance = web3.utils.fromWei(receivedBalance);
			expectedIncrease = new web3.utils.BN(oldRecepientBalance).add(new web3.utils.BN(web3.utils.fromWei('1000000000000000000'))).toString();
			assert.equal(expectedIncrease, newRecepientBalance, "the recepient got money");
			return purchasedRealIdInstance.isPurchasedReadId({ from : accounts[0] });
		}).then(function(purchaseConfimration){
			assert.isTrue(purchaseConfimration, "the sender gained purchase rights");
			return purchasedRealIdInstance.realIds(accounts[0]);
		}).then(function(storedRealId) {
			assert.isTrue(storedRealId[0], "can vote");
			assert.isTrue(storedRealId[1], "can drive");
			assert.isTrue(storedRealId[2], "can fly");
			assert.isTrue(storedRealId[3], "federal");
		});
	});

});