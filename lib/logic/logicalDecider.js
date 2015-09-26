var path = require('path');
var cwd = process.cwd();

var inputParser = require(path.join(cwd,'lib/fileParser/inputParser.js'));
var initialData, completeChainData, kingPosition, isOpponentKingFound = false, i, j, opponentCells = [];

var basicData = {
    playerID: ''
};

var getAllRange = function() {
    var temp = [];
    //get all possible options of range..
    for(i=0; i<=48; ++i){
        temp.push(i);
    }
    return temp;
};

var updateCrucialData = function() {
    initialData = inputParser.initialData;
    completeChainData = inputParser.completeChainData;
};

var randomNum = function(min,max) {
    return (Math.floor(Math.random() * (max - min +1)) + min);
};

var isValidCell = function(cellNum) {
    var row, col ;
    row = parseInt((cellNum-1)/7);
    col = parseInt((cellNum-1)%7);
    if(completeChainData[row][col].owner !== initialData.opponent) {
        return true;
    }
    return false;
};

var updateKing = function() {
    var range;
    var rand = randomNum(1,2);
    range = initialData['Expecting'].split(' ')[1];
    range = range.split('-');
    if(parseInt(range[0]) === 1) {
        //return 1 or 7
        return (rand === 1 ? 1 : 7);
    } else if(parseInt(range[0]) === 29) {
         //return 43 or 49
        return (rand === 1 ? 43 : 49);
    }
};

var updateOpponentPos = function () {
    opponentCells = [];
    for(i=0; i<7; i++) {
        for(j=0; j<7; j++){
            if(completeChainData[i][j].owner === initialData.opponent) {
                // add opponent positions..
                opponentCells.push[initialData.cellNumber];
            }
        }
    }
    return opponentCells;
};

var filterOutOpponents = function (range) {
    opponentCells = updateOpponentPos();
    //filter range from opponentCells..
    opponentCells.forEach(function(element) {
        var index = range.indexOf(element);
        if(index !== -1){
            range.splice(index,1);
        }
    });
    return range;
};
var filterOutKingPosition = function (rangea) {
    var index = range.indexOf(kingPosition);
    if(index !== -1){
        range.splice(index,-1);
    }
    return range;
};



//var updateCoins = function() {
//    //get all valid range..
//    var range = getAllRange();
//    //filter out all opponent cells..
//    range = filterOutOpponents(range);
//    console.log('rangee..',range);
//    range = filterOutKingPosition(range);
//    //TODO find CELLNUM
//    var cellNum = randomNum(0,range.length-1);
//    cellNum = range[cellNum];
////    var cellNum;
////    cellNum = randomNum(parseInt(range[0]),parseInt(range[48]));
//    if(!isValidCell(cellNum)) {
//        console.console.error('cell num  not valid..');
//    }
//    return cellNum;
//};


var protectKing = function(row, col) {
    console.log('protectKing');
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    
    /*Neighbour*/
    var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.owner === initialData.player && temp1.coin.toUpperCase() === 'K' && currentCellCount === 0) {
                currentCell.priority += 8;
            }
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
    
    /*Diagonal*/
    k = -1, t=1, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.owner === initialData.player && temp1.coin.toUpperCase() === 'K' && currentCellCount === 0) {
                currentCell.priority += 6;
            }
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
    
};

var isKingSafe = function(row, col) {
    console.log('isKingSafe');
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    
};

var findEqualOpponentsNeighBours = function(row, col) {
    console.log('findEqualOpponentsNeighBours');
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    
    var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.owner === initialData.opponent && currentCellCount > temp1.count) {
                currentCell.priority += 3;
            }
            else if(temp1.owner === initialData.opponent && (currentCellCount === temp1.count || (currentCellCount === 0 && temp1.count === 1))) {
                currentCell.priority += 2;
            }
            else if(temp1.owner === initialData.opponent && currentCellCount < temp1.count) {
                currentCell.priority -= 2;
            }
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
        
};

var isBurstPossibe = function(row, col) {
    console.log('isBurstPossibe');
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    
    if(currentCell.coun === currentCell.maxcap) {
        currentCell.priority += 4;
    }
    
    var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.owner === initialData.player && currentCellCount < currentCell.maxcap) {
                currentCell.priority += 0;
            }
            else if(temp1.owner === initialData.player && currentCellCount === currentCell.maxcap) {
                currentCell.priority += 2;
            }
            else if(temp1.owner === initialData.opponent && currentCellCount < currentCell.maxcap) {
                currentCell.priority += 1;
            }
            else if(temp1.owner === initialData.opponent && currentCellCount === currentCell.maxcap) {
                currentCell.priority += 3;
            }
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
        
};

var updateCoins = function() {
    debugger;
    console.log('updateCoins');
    //set initial priority..
    var maxCellID = 0;
    var maxPriority = 0;
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            
            var tempCell = completeChainData[i][j];
            tempCell.priority = 0;
            
            if(tempCell.owner === initialData.opponent) {
                tempCell.priority += -10;
            } else if(tempCell.owner === initialData.player && tempCell.coin.toUpperCase() === 'K') {
                //isKingSafe(i, j);
                // TODO comment
                tempCell.priority += -10;
            } else {
                protectKing(i, j);
                findEqualOpponentsNeighBours(i, j);
                isBurstPossibe(i,j);
            }
            
            if(tempCell.priority > maxPriority) {
                maxPriority = tempCell.priority;
                maxCellID = tempCell.cellNumber;
            }
        }
    }
    
    return maxCellID;
//    isKingSafe();
//    attackOpponentKing();
};

var findLogic = function(iter) {
    updateCrucialData();
    if(iter === 1 && initialData['Expecting'].charAt(0).toUpperCase() === 'K') {
        //find the place for KING
        kingPosition = updateKing();
        console.log(kingPosition);
        return ('K '+kingPosition);
    } else if(initialData['Expecting'].charAt(0).toUpperCase() === 'C') {
        //update Coins
        var coinPosition = updateCoins();
        console.log(coinPosition);
        return ('C '+coinPosition);
    } else {
        alert('expecting invalid');
    }
};

var errCode  = {};
errCode.foundOppKing =  function() {
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
