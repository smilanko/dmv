var AddressChange = artifacts.require("AddressChange");

contract("AddressChange", function(accounts){
	
	var addressChangeInstance;

	it("we have no addresses", function() {
		return AddressChange.deployed().then(function(instance) {
			return instance.addressCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

	it("address change processed", function() {
		return AddressChange.deployed().then(function(instance) {
			addressChangeInstance = instance;
			street = "310 main st";
			city = "Hampton";
			state = "VA";
			zip = 23606;
			return addressChangeInstance.changeAddress(street, city, state, zip, { from : accounts[0] });
		}).then(function(updatedAddr) {
			return addressChangeInstance.addresses(accounts[0]);
		}).then(function(addresses) {
			assert.equal("310 main st", addresses[0], "street match");
			assert.equal("Hampton", addresses[1], "city match");
			assert.equal("VA", addresses[2], "state match");
			assert.equal(23606, addresses[3], "zip match");
		});
	});


});