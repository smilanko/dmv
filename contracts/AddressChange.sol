pragma solidity ^0.5.0;

contract AddressChange {

	struct Address {
		string street;
		string city;
		string state;
		uint zip;
	}

	mapping(address => Address) public addresses;
	uint public addressCount;

    event addressUpdateEvent (
        address indexed _sender
    );

    function isAddressPresent() public view returns (bool) {
    	bytes memory tempEmptyStringTest = bytes(addresses[msg.sender].state); // Uses memory
    	return tempEmptyStringTest.length > 0;
	}

	function changeAddress(string memory _street, string memory _city, string memory _state, uint _zip ) public {
		addressCount++;
		addresses[msg.sender] = Address(_street, _city, _state, _zip);
		emit addressUpdateEvent(msg.sender);
	}

}