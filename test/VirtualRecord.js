var VirtualRecord = artifacts.require("VirtualRecord");

contract("VirtualRecord", function(accounts){
	
	var virtualRecordInstance;
	var officer = accounts[0];
	var citizen = accounts[1];

	it("address change processed", function() {
		return VirtualRecord.deployed().then(function(instance) {
			virtualRecordInstance = instance;
			return virtualRecordInstance.isExistsVirtualRecord(citizen);
		}).then(function(noRecordExists) {
			assert.isFalse(noRecordExists,"no record exists");
			return virtualRecordInstance.addVirtualRecord(citizen, true, true, { from : officer });
		}).then(function(updatedAddr) {
			return virtualRecordInstance.isExistsVirtualRecord(citizen);
		}).then(function(recordExists) {
			assert.isTrue(recordExists,"record exists");
			return virtualRecordInstance.virtualRecord(citizen);
		}).then(function(record) {
			assert.equal(1, record[0], "ticket match");
			assert.equal(1, record[1], "accident match");
			assert.equal(officer, record[2], "officer match");
		});
	});


});