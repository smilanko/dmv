pragma solidity ^0.5.0;

contract Titling {

    struct Title {
        uint vin;
    }

	mapping(address => Title) public carTitles;

    event carTitled (
    	address indexed _owner
    );

    function isCarTitled() public view returns (bool) {
        return carTitles[msg.sender].vin > 0;
    }

    function titleCar(uint _vin) public {
        if (!isCarTitled()) {
            carTitles[msg.sender] = Title(_vin);
            emit carTitled(msg.sender);
        }
    }

}