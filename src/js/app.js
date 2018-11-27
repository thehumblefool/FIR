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
      instance.reportFiledEvent({}, {}).watch(function(error, event) {
        alert("FIR is created with ID: " + event.args.reportID);
      });
    });
  },

  render: function() {

    console.log("Render");
    // $("fileFIRForm").hide();
    // $("displayFIRForm").hide();    

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  enableFileFIR : function() {
    console.log("enableFileFIR");
    var dFIR = $("#dFIR");
    dFIR.empty();
    var out = $("#out");
    out.empty();
    var fFIR = $("#fFIR");
    fFIR.empty();
    fFIR.append("<tr><td>" + "<input type=\"text\" placeholder=\"&emsp;Identity Proof\" id=\"fID\"/>" + "</td></tr>");
    fFIR.append("<tr><td>" + "<input type=\"text\" placeholder=\"&emsp;Name\" id=\"fName\"/>" + "</td></tr>");
    fFIR.append("<tr><td>" + "<input type=\"text\" placeholder=\"&emsp;Phone\" id=\"fPhone\"/>" + "</td></tr>");
    fFIR.append("<tr><td>" + "<textarea rows=\"12\" cols=\"70\" placeholder=\"   Report\" id=\"fReport\"></textarea>" + "</td></tr>");
    fFIR.append("<tr><td>" + "<button type=\"button\" class=\"btn btn-primary\" onClick=\"App.fileFIR();\">Submit</button>" + "</td></tr>");
  },

  enableGetFIR : function() {
    console.log("enableGetFIR");
    var fFIR = $("#fFIR");
    fFIR.empty();
    var dFIR = $("#dFIR");
    dFIR.empty();
    dFIR.append("<tr><td>" + "<input type=\"text\" placeholder=\"&emsp;FIR ID\" id=\"dID\"/><button type=\"text\" class=\"btn btn-primary\" onClick=\"App.getFIR();\">Submit</button>" + "</td></tr>");
  },

  fileFIR : function() {
    var ID = parseInt(document.getElementById("fID").value);
    var name = document.getElementById("fName").value;
    var phone = document.getElementById("fPhone").value;
    var report = document.getElementById("fReport").value;
    document.getElementById("fForm").reset();
    App.contracts.FIR.deployed().then(function(instance) {
      return instance.fileFIR(ID, name, phone, report, new Date().toString(), { from: App.account })
    });
  },

  getFIR : function() {
    var reportID = document.getElementById("dID").value.split(".");
    App.contracts.FIR.deployed().then(function(instance) {
      return instance.getFIRByID(parseInt(reportID[0]), parseInt(reportID[1]), { from: App.account }).then( function(result) {
        var out = $("#out");
        out.empty();
        if(result[0]=="") {
          alert("FIR not found");
          return;
        }
        out.append("<tr><td>FIR ID: " + result[0] + "</td></tr>");
        out.append("<tr><td>Name: " + result[2] + "</td></tr>");
        out.append("<tr><td>ID: " + result[1].toNumber() + "</td></tr>");
        out.append("<tr><td>Phone: " + result[3].toNumber() + "</td></tr>");
        out.append("<tr><td>Time: " + result[5] + "</td></tr>");
        out.append("<tr><td>Report: " + result[4] + "</td></tr>");
        out.append("<tr><td>Officer: " + result[6] + "</td></tr>");
      })
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});