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

	// registration event
    event registrationEvent (
        address indexed _vin
    );

	constructor() public {
		// nothing for now
	}

	function isRegistrationPresent() public view returns (bool) {
		return registrations[msg.sender].car_vin > 0;
	}

	function processRegistration(uint _vin, uint _year, string memory _model, string memory _firstName, string memory _lastName) public {
		registrationCount++;
		registrations[msg.sender] = Registration(_vin, _year, _model, msg.sender, _firstName ,_lastName);
		emit registrationEvent(msg.sender);
	}

}