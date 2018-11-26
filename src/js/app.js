App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("FIR.json", function(FIR) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.FIR = TruffleContract(FIR);
      // Connect provider to interact with contract
      App.contracts.FIR.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function() {
    App.contracts.FIR.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.reportFiledEvent({}, {
        fromBlock: '0',
        toBlock: 'latest'
      }).watch(function(error, event) {
        alert("FIR is created with ID: " + event.args.reportID);
        App.render();
      });
    });
  },

  render: function() {

    console.log("Render");
    // $("#fileFIRForm").hide();
    // $("#displayFIR").hide();

    var FIRInstance;

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.FIR.deployed().then(function(instance) {
      FIRInstance = instance;

      //1 File FIR
      //2 Search FIR
      /*var choice = parseInt(prompt("Enter your choice : "));
      console.log(choice);
      if(choice==1) {
        FIRInstance.fileFIR(1, "Sai Pavan", 9501353370, "Lost a mobile", new Date().toString(), { from: App.account });
      } else if(choice==2) {
        var reportID = prompt("Enter ReportID ").split(".");
        FIRInstance.getFIRByID(parseInt(reportID[0]), parseInt(reportID[1]), { from: App.account }).then(
          function(result) {
            console.log(result[0]);
            console.log(result[1].toNumber());
            console.log(result[2]);
            console.log(result[3].toNumber());
            console.log(result[4]);
            console.log(result[5]);
            console.log(result[6]);
          });
      }*/
    });
  },

  enableFileFIR : function() {
    $("fileFIRForm").show();
    $("displayFIRForm").hide();
  },

  enableGetFIR : function() {
    $("displayFIRForm").show();
    $("fileFIRForm").hide();
  },

  fileFIR : function() {
    var ID = parseInt(document.getElementById("fID").value);
    console.log(ID);
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});