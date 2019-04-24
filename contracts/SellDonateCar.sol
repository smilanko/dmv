pragma solidity ^0.5.0;

contract SellDonateCar {

	struct Car {
        uint year;
        string make;
        string model;
	}

    uint public cost = 1 ether;
	mapping(address => Car) public cars;

    event carSoldDonated (
    	address indexed _owner
    );

    function isCarOwned(address _owner) public view returns (bool) {
        return cars[_owner].year > 0;
    }

    function addCarForSale(uint _year, string memory _make, string memory _model) public returns (bool) {
        // to make thing simple, 1 owner 1 sale
        if (!isCarOwned(msg.sender)) {
            cars[msg.sender] = Car(_year, _make, _model);
        }
    }

    function purchaseCar(address payable _owner) payable public {
        if (isCarOwned(_owner) && !isCarOwned(msg.sender)) {
            require(msg.value == cost);
            _owner.transfer(msg.value);
            // transfer the car
            cars[msg.sender] = Car(cars[_owner].year, cars[_owner].make, cars[_owner].model );
            cars[_owner] = Car(0, "", "");
            emit carSoldDonated(_owner);
        }
    }

}