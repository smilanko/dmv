var VehicleRegistrationRenewal = artifacts.require("VehicleRegistrationRenewal");

contract("VehicleRegistrationRenewal", function(accounts){
	
	it("we have no vehicle registrations", function() {
		return VehicleRegistrationRenewal.deployed().then(function(instance) {
			return instance.registrationCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

});