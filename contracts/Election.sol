pragma solidity ^0.4.22;

contract Election {
	
	constructor() public {
		addCandidate("Sachin");
		addCandidate("Divya");
	}

	// Modal a candidate
	struct Candidate {
		uint id;
		string name;
		uint voteCount;
	}

	// Read/Write candidates
	mapping(uint => Candidate) public candidates;

	// Keep track of voters
	mapping(address => bool) public voters;

	uint public candidatesCount;
	
	event votedEvent (
        uint indexed _candidateId
    );

	function addCandidate(string _name) private {
		candidatesCount++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote(uint _candidateId) public {
		require(!voters[msg.sender]);
		require(_candidateId > 0 && _candidateId <= candidatesCount);
		voters[msg.sender] = true;
		candidates[_candidateId].voteCount++;

		// trigger voted event
    	emit votedEvent(_candidateId);
	}
}