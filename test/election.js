var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {

	var instance;

	it("initializes with two candidates", function(){
		return Election.deployed().then(function(i){
			return i.candidatesCount();
		}).then(function(count){
			assert.equal(count, 2);
		});
	});

	it("initializes candidates with correct values", function(){
		return Election.deployed().then(function(i){
			instance = i;
			return instance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[0],1,"candidate has correct id");
			assert.equal(candidate[1],"Sachin","candidate has correct name");
			assert.equal(candidate[2],0,"candidate has correct vote count");
			return instance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[0],2,"candidate has correct id");
			assert.equal(candidate[1],"Divya","candidate has correct name");
			assert.equal(candidate[2],0,"candidate has correct vote count");
		});
	});

	it("allows a voter to cast a vote", function(){
		return Election.deployed().then(function(i){
			instance = i;
			candidateId = 1;
			return i.vote(candidateId, { from: accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, "an event was triggered");
			assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
			assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
			return instance.voters(accounts[0]);
		}).then(function(voted){
			assert(voted, "the voter was marked as voted");
			return instance.candidates(candidateId);
		}).then(function(candidate){
			assert.equal(candidate[2], 1, "candidate vote count has increased");
		});
	});

	it("throws exception for invalid candidates", function() {
		return Election.deployed().then(function(i) {
			instance = i;
			return instance.vote(99, {from: accounts[1]});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, "error message must contains revert string");
			return instance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[2], 1, "Sachin did not receive any votes");
			return instance.candidates(2);
		}).then(function(candidate){
			assert.equal(candidate[2], 0, "Divya did not receive any votes");
			return instance.voters(accounts[1]);
		}).then(function(voted){
			assert(!voted, "Voters vote did not get counted");
		});
	});

	it("throw exception if voter votes twice", function() {
		Election.deployed().then(function(i){
			instance = i;
			return vote(2, {from: accounts[0]});
		}).then(assert.fail).catch(function(error){
			assert(error.indexOf("revert") >= 0, "Voter has already voted");
			return instance.candidates(1);
		}).then(function(candidate) {
			assert.equal(candidate[2], 1, "Sachin did not receive any votes");
			return instance.candidates(2);
		}).then(function(candidate) {
			assert.equal(candidate[2], 0, "Divya did not receive any votes");
		})
	});
});