pragma solidity ^0.5.0;

contract VirtualRecord {

	struct Record {
		uint numberOfTickets;
        uint numberOfAccidents;
        address updatedByOfficer;
	}
	mapping(address => Record) public virtualRecord;

    event recordUpdated (
    	address indexed _owner
    );

    function isExistsVirtualRecord(address _citizen) public view returns (bool) {
    	return virtualRecord[_citizen].numberOfTickets > 0 || virtualRecord[_citizen].numberOfAccidents > 0;
	}

	function addVirtualRecord(address _citizen, bool _was_accident, bool _was_ticket) payable public {
        if (_was_accident) {
            uint accidentCount = virtualRecord[_citizen].numberOfAccidents + 1;
            virtualRecord[_citizen] = Record(virtualRecord[_citizen].numberOfTickets, accidentCount, msg.sender);
            emit recordUpdated(_citizen);
        }
        if (_was_ticket) {
            uint ticketCount = virtualRecord[_citizen].numberOfTickets + 1;
            virtualRecord[_citizen] = Record(ticketCount, virtualRecord[_citizen].numberOfAccidents, msg.sender);
			emit recordUpdated(_citizen);
		}
	}
}