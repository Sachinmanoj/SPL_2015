//var q = require('q');
var path = require('path');
var cwd = process.cwd();
var config = require(path.join(cwd,'config.json'));
    
var initial = {}, inputContents, i;
//init completeChainData
var completeChainData = new Array(7);
for(i=0; i<=6; ++i) {
    completeChainData[i] = new Array(7);
}

var parsedChainData = {
    owner: '',
    coin: '',
    count: ''
};

var parseInitial = function(data) {
    
    inputContents  = data.split('\n');
    
    if(inputContents.length !== 56) {
        alert('Invalid length for input file');
    }
//    console.log(inputContents);
    
    for(i=0; i<7; ++i) {
        
        var indInput  = inputContents[i].split('=');
        var indKey = indInput[0].trim();
        var indValue = indInput[1].trim();
            
        if(i !== 1 && i !== 2 && i !==3 && i !== 4) {
            initial[indKey] = indValue;
            
            console.log(indKey,indValue);
        }
        else if (i === 1) {
            console.log(indKey,indValue);
            if(indValue.toLowerCase() === config.teamName.toLowerCase()) {
                initial.player = 1;
            }
            else {
                initial.player = 2;
            }
        } else {
            console.log(indKey,indValue);
        }
        
    }
    return;
};

var parseMoves = function(data) {
    
    inputContents  = data.split('\n');
    
    for(i=7; i<56; ++i) {
        var indInput  = inputContents[i].split('=');
        var indKey = parseInt(indInput[0].trim());
        var indValue = indInput[1].trim();
        var coinData = indValue.split(',');
        var row, col;
        row = parseInt((indKey-1)/7);
        col = parseInt((indKey-1)%7);
        
        completeChainData[row][col] = {
            owner: parseInt(coinData[0]),
            coin: coinData[1],
            count: parseInt(coinData[2])
        };
    }
    
};

module.exports.parseInitial = parseInitial;
module.exports.parseMoves = parseMoves;
module.exports.initialData =  initial;
module.exports.completeChainData =  completeChainData;