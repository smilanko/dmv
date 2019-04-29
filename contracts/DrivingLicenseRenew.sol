pragma solidity ^0.5.0;

contract DrivingLicenseRenew {

	struct License {
		uint expiration;
	}

	mapping(address => License) public renewals;
	uint public renewCount;

    event licenceRenewEvent (
        address indexed _ssn
    );

    function personHasLicense(address _person) public view returns (bool) {
    	return true;
    }

    function isRenewalPresent() public view returns (bool) {
    	return renewals[msg.sender].expiration > 0;
	}

	function renewLicense() public {
		if (personHasLicense(msg.sender)) {
			renewCount++;
			uint _extension_period = 10;
			uint _expiring_year = (now / 31536000) + 1970 + _extension_period;
			renewals[msg.sender] = License(_expiring_year);
			emit licenceRenewEvent(msg.sender);
		}
	}

}