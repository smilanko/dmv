pragma solidity ^0.5.0;

contract VehicleRegistrationRenewal {

	struct Registration {
		uint car_vin;
		uint car_year;
		string car_model;
		uint expiring_year;
	}

	mapping(address => Registration) public registrations;

	uint public registrationCount;

	// registration event
    event registrationEvent (
        uint indexed _vin
    );

	function isRegistrationPresent() public view returns (bool) {
		return registrations[msg.sender].expiring_year > 0;
	}

	function processRegistration(uint _vin, uint _year, string memory _model) public {
		if (!isRegistrationPresent()) {
			registrationCount++;
			uint _expiring_year = (now / 31536000) + 1970;
			registrations[msg.sender] = Registration(_vin, _year, _model, _expiring_year);
			emit registrationEvent(_vin);
		}
	}

	function reportSoldTraded(address _to) public {
		if (isRegistrationPresent()) {
			uint _car_vin = registrations[msg.sender].car_vin;
			uint _car_year = registrations[msg.sender].car_year;
			string memory _car_model = registrations[msg.sender].car_model;
			uint _expiring_year = registrations[msg.sender].expiring_year;
			registrations[msg.sender] = Registration(0, 0, "", 0);
			registrations[_to] = Registration(_car_vin, _car_year, _car_model, _expiring_year);
			emit registrationEvent(_car_vin);
		}
	}

}