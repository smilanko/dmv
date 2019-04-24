pragma solidity ^0.5.0;

contract ReadLid {

	struct Identification {
		bool canVote;
		bool canDrive;
		bool canFly;
		bool federalEnabled;
	}

	uint public realIdCost = 1 ether; 
	mapping(address => Identification) public realIds;
	mapping(address => bool) public purchases;

    event purchasedRealId (
    	address indexed _purchaser
    );

    function isPurchasedReadId() public view returns (bool) {
		return purchases[msg.sender] == true;
	}

    function isRegisteredVoter() public view returns (bool) {
    	return realIds[msg.sender].canVote;
    }

    function isRegisteredDriver() public view returns (bool) {
    	return realIds[msg.sender].canDrive;
    }

    function isRegisteredFlyer() public view returns (bool) {
    	return realIds[msg.sender].canFly;
    }

    function isFederal() public view returns (bool) {
    	return realIds[msg.sender].federalEnabled;
	}

	function purchaseRealId(address payable _addr, bool _can_vote, bool _can_drive, bool _can_fly, bool _federal) payable public {
		if (!isPurchasedReadId()) {
			require(msg.value == realIdCost);
        	_addr.transfer(msg.value);
        	// we can now add them as a real id owner
        	realIds[msg.sender] = Identification(_can_vote, _can_drive, _can_fly, _federal);
        	purchases[msg.sender] = true;
			emit purchasedRealId(msg.sender);
		}
	}
}