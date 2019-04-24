var SellDonateCar = artifacts.require("SellDonateCar");

contract("SellDonateCar", function(accounts){
	
	var sellDonateCarInstance;
	var oldRecepientBalance;
	var newRecepientBalance;
	var carOwner = accounts[5];

	var oldSenderBalance;
	var newSenderBalance;
	var carPurchaser = accounts[6];

	it("car purchased", function() {
		return SellDonateCar.deployed().then(function(instance) {
			sellDonateCarInstance = instance;
			return sellDonateCarInstance.isCarOwned(carOwner);
		}).then(function(carOwned) {
			assert.isFalse(carOwned, "no cars are owned");
			return sellDonateCarInstance.addCarForSale(1990, "ford", "focus", {from: carOwner});
		}).then(function(carListed) {
			return sellDonateCarInstance.isCarOwned(carOwner);
		}).then(function(carOwned) {
			assert.isTrue(carOwned, "1 car is owned");
			return web3.eth.getBalance(carOwner);
		}).then(function(receivedBalance) {
			oldRecepientBalance = web3.utils.fromWei(receivedBalance);
			return sellDonateCarInstance.purchaseCar(carOwner, { from : carPurchaser, value: 1000000000000000000 });
		}).then(function(sendReceipt) {
			return web3.eth.getBalance(carOwner);
		}).then(function(receivedBalance) {
			newRecepientBalance = web3.utils.fromWei(receivedBalance);
			expectedIncrease = Math.round(oldRecepientBalance) + 1;
			assert.equal(Math.round(newRecepientBalance), Math.round(expectedIncrease), "the recepient got money");
			return sellDonateCarInstance.isCarOwned(carPurchaser);
		}).then(function(purchaseConfimration){
			assert.isTrue(purchaseConfimration, "the sender gained purchase rights");
			return sellDonateCarInstance.isCarOwned(carOwner);
		}).then(function(sellerPurchaseRights) {
			assert.isFalse(sellerPurchaseRights, "the seller lost purchase rights");
		});
	});

});