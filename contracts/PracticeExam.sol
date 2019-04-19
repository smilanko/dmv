pragma solidity ^0.5.0;

contract PracticeExam {

	struct PracticeQuestion {
		string question;
		string answer;
	}

	uint public examCost = 1 ether;
	mapping(address => PracticeQuestion) public questions;
	mapping(address => bool) public purchaseList;

	event practiceQuestionsPurchased (
        address indexed _purchaser
    );

    function isExamPurchased() public view returns (bool) {
    	return purchaseList[msg.sender];
	}

	function purchaseExam(address payable _addr) payable public {
		if (!isExamPurchased()) {
			// take the money
			require(msg.value == examCost);
        	_addr.transfer(msg.value);
        	// display the practice questions
        	questions[msg.sender] = PracticeQuestion("What color is the stop sign?", "Red");
        	purchaseList[msg.sender] = true;
			emit practiceQuestionsPurchased(msg.sender);
		}
		
	}

}