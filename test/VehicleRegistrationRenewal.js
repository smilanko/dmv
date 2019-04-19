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
			return registrationInstance.processRegistration(vin, year, model, { from : accounts[0] });
		}).then(function(receipt) {
			return registrationInstance.isRegistrationPresent({ from : accounts[0] });
		}).then(function(registered) {
			assert(registered, "user marked as registered car");
			return registrationInstance.registrations(accounts[0]);
		}).then(function(registrations) {
			assert.equal(123, registrations[0], "vin match");
			assert.equal(1990, registrations[1], "year match");
			assert.equal("toyota", registrations[2], "model match");
			assert.equal(new Date().getFullYear(), registrations[3], "expiring year match");
		});
	});

	it("vehicle transferred", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			registrationInstance = instance;
			vin = 123;
			year = 1990;
			model = "toyota";
			return registrationInstance.processRegistration(vin, year, model, { from : accounts[0] });
		}).then(function(receipt) {
			return registrationInstance.isRegistrationPresent({ from : accounts[0] });
		}).then(function(registered) {
			assert(registered, "user marked as registered car");
			return registrationInstance.reportSoldTraded(accounts[1]);
		}).then(function(updated_recepipt) {
			return registrationInstance.isRegistrationPresent({ from : accounts[0] });
		}).then(function(updated_registration) {
			assert.isFalse(updated_registration, "original no longer registered");
			return registrationInstance.registrations(accounts[1]);
		}).then(function(registrations) {
			assert.equal(123, registrations[0], "vin match");
			assert.equal(1990, registrations[1], "year match");
			assert.equal("toyota", registrations[2], "model match");
			assert.equal(new Date().getFullYear(), registrations[3], "expiring year match");
			return registrationInstance.registrations(accounts[0]);
		}).then(function(registrations) {
			assert.equal(0, registrations[0], "vin match");
			assert.equal(0, registrations[1], "year match");
			assert.equal("", registrations[2], "model match");
			assert.equal(0, registrations[3], "expiring year match");
		});
	});


});