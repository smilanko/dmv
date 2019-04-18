var VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");

contract("VehicleRegistrationRenewal", function(accounts){
	
	it("we have no vehicles", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			return instance.vehicleCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

	it("we have no owners", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			return instance.ownerCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

});