pragma solidity ^0.5.0;

contract VehicleRegistrationRenewal {

	struct Vehicle {
		uint vin;
		uint year;
		string model;
	}

	struct Owner {
		uint ssn;
		string first_name;
		string last_name;
	}

	mapping(uint => Vehicle) public vehicles;
	mapping(uint => Owner) public owners;

	uint public ownerCount;
	uint public vehicleCount;

	constructor() public {
		
	}

	function registerVehicle(uint _vin, uint _year, string memory _model, uint _ssn, string memory _firstName, string memory _lastName) private {
		ownerCount++;
		vehicleCount++;
		vehicles[vehicleCount] = Vehicle(_vin, _year, _model);
		owners[ownerCount] = Owner(_ssn, _firstName ,_lastName);
	}

}