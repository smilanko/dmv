pragma solidity ^0.5.0;

contract VehicleRegistrationRenewal {

	struct Registration {
		uint car_vin;
		uint car_year;
		string car_model;
		uint owner_ssn;
		string owner_first_name;
		string owner_last_name;
	}

	mapping(uint => Registration) public registrations;
	uint public registrationCount;

	constructor() public {
		// nothing for now
	}

	function processRegistration(uint _vin, uint _year, string memory _model, uint _ssn, string memory _firstName, string memory _lastName) private {
		registrationCount++;
		registrations[registrationCount] = Registration(_vin, _year, _model, _ssn, _firstName ,_lastName);
	}

}