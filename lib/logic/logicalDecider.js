var path = require('path');
var cwd = process.cwd();

var inputParser = require(path.join(cwd,'lib/fileParser/inputParser.js'));
var initalData, completeChainData, kingPosition, isOpponentKingFound = false;

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

var errCode  = {};
errCode.foundOppKing =  funtion() {
    console.info('Opponent king Found');
    isOpponentKingFound = true;
};
errCode.placedOnOppCell =  function() {
     console.error('Placed on opponent CELL');
};
errCode.placedOnOurKing =  function() {
    console.error('Placed on our King');
};
errCode.unexpectedKingValue = function() {
    console.error('Placed our king in wrong cell..');
};

var processErrorCode = function(ackCode) {
    ackCode = parseInt(ackCode);
    //process err code
    switch(ackCode) {
        case 0:  
            console.info('valid code..'); 
            break;
        case 3:
            errCode.unexpectedKingValue();
            break;
        case 8:
            errCode.placedOnOurKing();
            break;
        case 9:
            errCode.placedOnOppCell();
            break;
        case 100:  
            errCode.foundOppKing(); 
            break;
        default: 
            console.info('ack code received',ackCode);
    }
};


module.exports.findLogic = findLogic;
module.exports.processErrorCode = processErrorCode;