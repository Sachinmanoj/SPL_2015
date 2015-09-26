var path = require('path');
var cwd = process.cwd();

var inputParser = require(path.join(cwd,'lib/fileParser/inputParser.js'));
var initalData, completeChainData, kingPosition;

var basicData = {
    playerID: ''
};

var updateCrucialData = function() {
    initalData = inputParser.initialData;
    completeChainData = inputParser.completeChainData;
};

var randomNum = function(min,max) {
    return (Math.floor(Math.random() * (max - min +1)) + min);
};

var isValidCell = function(cellNum) {
    var row, col ;
    row = parseInt((cellNum-1)/7);
    col = parseInt((cellNum-1)%7);
    if(completeChainData[row][col].owner !== initalData.opponent) {
        return true;
    }
    return false;
};

var updateKing = function() {
    var range;
    range = initalData['Expecting'].split(' ')[1];
    range = range.split('-');
    return randomNum(parseInt(range[0]),parseInt(range[1]));  
};

var updateCoins = function() {
    var range = [1, 49];
    var cellNum;
    do {
        cellNum = randomNum(parseInt(range[0]),parseInt(range[1]));  
        console.log(cellNum);
    } while(!isValidCell(cellNum));
    return cellNum;
    
};

var findLogic = function(iter) {
    updateCrucialData();
    if(iter === 1 && initalData['Expecting'].charAt(0).toUpperCase() === 'K') {
        //find the place for KING
        kingPosition = updateKing();
        console.log(kingPosition);
        return ('K '+kingPosition);
    } else if(initalData['Expecting'].charAt(0).toUpperCase() === 'C') {
        //update Coins
        var coinPosition = updateCoins();
        console.log(coinPosition);
        return ('C '+coinPosition);
    } else {
        alert('expecting invalid');
    }
};

var processErrorCode = function(ackCode){
    console.info('ack code received',ackCode);
};


module.exports.findLogic = findLogic;
module.exports.processErrorCode = processErrorCode;