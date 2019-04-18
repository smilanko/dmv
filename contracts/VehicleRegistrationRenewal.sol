pragma solidity ^0.5.0;

contract VehicleRegistrationRenewal {

	struct Registration {
		uint car_vin;
		uint car_year;
		string car_model;
		address owner_pk;
		string owner_first_name;
		string owner_last_name;
	}

	mapping(address => Registration) public registrations;

	uint public registrationCount;

	constructor() public {
		// nothing for now
	}

	function isRegistrationPresent(address _ownerPk) public view returns (bool) {
		return registrations[_ownerPk].car_vin > 0;
	}

	function processRegistration(uint _vin, uint _year, string memory _model, address _ownerPk, string memory _firstName, string memory _lastName) private {
		registrationCount++;
		registrations[_ownerPk] = Registration(_vin, _year, _model, _ownerPk, _firstName ,_lastName);
	}

}