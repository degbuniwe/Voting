App = {
  web3Provider: null,
  contracts: {},
  account:0x0,



  init: function () {

   return App.initWeb3()
   
  },
   

  initWeb3: async() => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      //specify defualt instance if no web3 instance provided
      App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
       web3 = new web3(App.web3Provider);
    }


      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */});
        } catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Voting.json", function(voting) {
      //initialise a new truffle contract from the artifact
      App.contracts.Voting = TruffleContract(voting)
      //connect provider to interact with contract
      App.contracts.Voting.setProvider(App.web3Provider)

      return App.render();
    });
    
  },

  render: function(){
     var votingInstance;
     var loader = $("#loader");
     var content = $("#content");

     loader.show();
     content.hide();

     //load accouunt data
     web3.eth.getCoinbase(function( err, account) {
      if (err === null){
        App.account = account;
        $("#accountAddress").html("Your Account:" + account);
      }
     });

     //load contract

     App.contracts.Voting.deployed().then(function(instance) {
      votingInstance = instance;
      return votingInstance.candidatesCount();
     }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      candidatesResults.empty();

      for (var i = 1; i <= candidatesCount; i++) {
        votingInstance.candidates(i).then(function(candidate){
          var id = candidate[0];
          var name = candidate[1];
          var voteCount = candidate[2];

          //render Result

          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          candidatesResults.append(candidateTemplate);
        });
      }

      loader.hide();
      content.show();
     }).catch(function(error) {
      console.warn(error);
     });
  }

  
 };

$(function() {
  $(window).load(function() {
    App.init();
  });
});
