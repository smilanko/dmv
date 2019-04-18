var VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");

contract("VehicleRegistrationRenewal", function(accounts){
	
	var registrationInstance;

	it("we have no vehicle registrations", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			return instance.registrationCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

	it("registration processed", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			registrationInstance = instance;
			vin = 123;
			year = 1990;
			model = "toyota";
			fname = "joe";
			lname = "cools";
			return registrationInstance.processRegistration(vin, year, model, fname, lname, { from : accounts[0] });
		}).then(function(receipt) {
			return registrationInstance.isRegistrationPresent({ from : accounts[0] });
		}).then(function(registered) {
			assert(registered, "user marked as registered car");
			return registrationInstance.registrations(accounts[0]);
		}).then(function(registrations) {
			assert.equal(123, registrations[0], "vin match");
			assert.equal(1990, registrations[1], "year match");
			assert.equal("toyota", registrations[2], "model match");
			assert.equal(accounts[0], registrations[3], "pk match");
			assert.equal("joe", registrations[4], "fisrt name match");
			assert.equal("cools", registrations[5], "fisrt name match");
		});
	});


});