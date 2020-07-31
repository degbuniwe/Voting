pragma solidity ^0.5.0;

//creating the contract
contract Voting{

	//creating structure to model voting

	struct Candidate{
		uint id;
		string name;
		uint voteCount;
	}
	//use mapping to get or fetch details

	mapping(uint=> Candidate) public candidates;

	mapping(address => bool) public voters;
	//add a public state variable to keep track of candidate count

	uint public candidatesCount;

	constructor() public{
		addCandidate("Richard Denton");
		addCandidate("Jeff Bridges");
	}

	//function to add candidates

	function addCandidate (string memory _name) private {
		candidatesCount ++;
		candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
	}

	function vote(uint _candidateId) public {
		candidates[_candidateId].voteCount++;
		voters[msg.sender] = true;
	}	
}