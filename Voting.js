var Voting = artifacts.require("./Voting.sol");

contract("Voting", function(accounts){
	var votingInstance;
	
	//to check initialisation

	it("initialises with two candidates", function() {
		return Voting.deployed().then(function(instance){
			return instance.candidatesCount();
		}).then(function(count){
			assert.equal(count, 2);
		});
	});
});

	it("it initialises the candidates with the correct values", function() {
		return Voting.deployed().then(function(instance) {
			votingInstance = instance;
			return votingInstance.candidates(1);

		}) .then(function(candidate) {
			assert.equal(candidate[0], 1, "contains the correct id");
			assert.equal(candidate[1], "Richard Denton", "contains the correct name");
			assert.equal(candidate[2], 0, "contains the correct vote count");
			return votingInstance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0], 2, "contains the correct id");
			assert.equal(candidate[1], "Jeff Bridges", "contains the correct name");
			assert.equal(candidate[2], 0, "contains the correct vote count");
		});

	});


	 it("allows a voter to cast a vote", function() {
    return Voting.deployed().then(function(instance) {
      votingInstance = instance;
      candidateId = 1;
      var accounts;
      return votingInstance.vote.call(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "an event was triggered");
      assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
      assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      return votingInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "the voter was marked as voted");
      return votingInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "increments the candidate's vote count");
    })
  });