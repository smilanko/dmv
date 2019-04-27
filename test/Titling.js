var Titling = artifacts.require("Titling");

contract("Titling", function(accounts){
	
	var titlingInstance;

	it("we have no title", function() {
		return Titling.deployed().then(function(instance) {
			titlingInstance = instance;
			return titlingInstance.isCarTitled();
		}).then(function(titled) {
			assert.isFalse(titled, "car is not titled");
			return titlingInstance.titleCar(123);
		}).then(function(receipt) {
			return titlingInstance.isCarTitled();
		}).then(function(titled_updated) {
			assert.isTrue(titled_updated, "car is titled");
		});
	});

});