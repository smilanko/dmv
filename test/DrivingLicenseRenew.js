var DrivingLicenseRenew = artifacts.require("DrivingLicenseRenew");

contract("DrivingLicenseRenew", function(accounts){
	
	var renewalInstance;


	it("no renewals present", function() {
		return DrivingLicenseRenew.deployed().then(function(instance) {
			return instance.renewCount();
		}).then(function(count) {
			assert.equal(count, 0);
		});
	});

	it("renewal processed", function() {
		return DrivingLicenseRenew.deployed().then(function(instance) {
			renewalInstance = instance;
			return renewalInstance.isRenewalPresent({ from : accounts[0] });
		}).then(function(renewalPresent){
			assert.isFalse(renewalPresent, "no renewal exists"); 
			return renewalInstance.renewLicense({ from : accounts[0] });
		}).then(function(renewalCount) {
			assert(renewalCount, "we have a renewal");
			return renewalInstance.renewals(accounts[0]);
		}).then(function(registrations) {
			assert.equal(new Date().getFullYear() + 10, registrations, "expiring year match");
			return renewalInstance.renewCount();
		}).then(function(reCount) {
			assert.equal(reCount, 1);
			return renewalInstance.isRenewalPresent({ from : accounts[0] });
		}).then(function(renewalPresent) {
			assert.isTrue(renewalPresent, "renewal now exists");
		});
	});


});