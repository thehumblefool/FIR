pragma solidity ^0.4.2;

contract FIR {

	struct Report {
		string reportID;
		uint ID;
		string name;
		uint phone;
		string report;
		string time;
		address filedBy;
	}

	event reportFoundEvent (
		Report report
	);

	mapping(address => Report[]) public nodeWiseReports;

	mapping(uint  => mapping(uint => Report)) public IDWiseReports;

	mapping (address => uint) nodeID;

	uint public nodeCount;
	

	constructor() public {
		nodeCount = 0;
	}

	function fileFIR(uint _ID, string _name, uint _phone, string _report, string _time) {
		if(nodeID[msg.sender]==0) {
			++nodeCount;
			nodeID[msg.sender] = nodeCount;
		}
		uint _half1ID = nodeID[msg.sender];
		uint _half2ID = nodeWiseReports[msg.sender].length + 1;
		string reportID = strConcat(strConcat(uint2str(_half1ID), "."), uint2str(_half2ID));
		Report fir = Report(reportID, _ID, _name, _phone, _report, _time, msg.sender);
		IDWiseReports[_half1ID][_half2ID] = fir;
		nodeWiseReports[msg.sender].push(fir); 
	}

	function uint2str(uint _i) public pure returns (string){
	    if (_i == 0) return "0";
	    uint j = _i;
	    uint length;
	    while (j != 0){
	        length++;
	        j /= 10;
	    }
	    bytes memory bstr = new bytes(length);
	    uint k = length - 1;
	    while (_i != 0){
	        bstr[k--] = byte(48 + _i % 10);
	        _i /= 10;
	    }
	    return string(bstr);
	}

	function strConcat(string _a, string _b) public returns (string){
	    bytes memory _ba = bytes(_a);
	    bytes memory _bb = bytes(_b);
	    string memory ab = new string(_ba.length + _bb.length);
	    bytes memory bab = bytes(ab);
	    uint k = 0;
	    for (uint i = 0; i < _ba.length; i++) bab[k++] = _ba[i];
	    for (i = 0; i < _bb.length; i++) bab[k++] = _bb[i];
	    return string(bab);
	}

	/* function parseInt(string _a, uint _b) internal returns (uint) {
		bytes memory bresult = bytes(_a);
		uint mint = 0;
		for (uint i = 0; i < bresult.length; i++) {
			mint = mint*10 + (uint(bresult[i]) - 48);
		}
		while(_b!=0) {
			mint = mint*10 + _b%10;
			_b /= 10;
		}
		return mint;
	} */
}
