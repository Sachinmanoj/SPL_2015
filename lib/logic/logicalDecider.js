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


var isVisited = function() {
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            completeChainData[i][j].isVisited = false;
        }
    }
};

var protectKing = function(row, col) {
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

var recursiveKingSafe = function(currentCell, row, col, callback) {
    /*Neighbour*/
    debugger;
    var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.count === temp1.maxCap) {
                if(temp1.owner === initialData.opponent) {
                    if(currentCell) {
                        currentCell.priority += 200;
                        return 'burst';
                    }
                    
                }
                else if(temp1.owner === initialData.player  && !temp1.isVisited) {
                    temp1.isVisited = true;
                    var returnValue = recursiveKingSafe(temp1, row + k, col + t);
                    if(returnValue) {
                        return 'burst';
                    }
                }
            }
            
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
    
    return '';
    
};

var isKingSafe = function(row, col) {
    debugger;
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    
     var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.count === temp1.maxCap) {
                if(temp1.owner === initialData.opponent) {
                    currentCell.priority += 500;
                    return 'DoSwap';
                }
            }
            
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
    isVisited();
    completeChainData[row][col].isVisited = true;
    return recursiveKingSafe(undefined, row, col);
    
};

var findEqualOpponentsNeighBours = function(row, col) {
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

var doswap = function(kingCell) {
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            var tempCell = completeChainData[i][j];
            if(tempCell.owner === initialData.opponent) {
            }
            else if(tempCell.owner === initialData.player && tempCell.coin.toUpperCase() === 'K') {
            }
            else {
                /*Neighbour*/
                var k = -1, t=0, l, s = 0;
                for(var x=0; x<4; x++) {
                    try{
                        var temp1 = completeChainData[i + k][j + t];
                        if(!(temp1.owner === initialData.opponent && temp1.count === temp1.maxCap)) {
                            s++;
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
                for(var y=0; y<4; y++) {
                    try{
                        var temp2 = completeChainData[i + k][j + t];
                        if(!(temp2.owner === initialData.opponent && temp2.count === temp2.maxCap)) {
                            s++;
                        }
                    }
                    catch(err) {

                    }

                    l = -k;
                    k = t;
                    t = l;
                }
    
                if((tempCell.maxCap === 1 && s === 3) || (tempCell.maxCap === 2 && s === 5) || (tempCell.maxCap === 3 && s === 8)) {
                    return kingCell.cellNumber + '-' + tempCell.cellNumber;
                }
            }
        }
    }
    return;
};

var recursiveAttackKing = function(row, col) {
    /*Neighbour*/
    debugger;
    var k = -1, t=0, l;
    for(var i=0; i<4; i++) {
        try{
            var temp1 = completeChainData[row + k][col + t];
            if(temp1.count === temp1.maxCap) {
                if(temp1.owner === initialData.player) {
                    temp1.priority += 1000;
                    return 'burst';
                    
                }
                else if(temp1.owner === initialData.opponent && !temp1.isVisited) {
                    temp1.isVisited = true;
                    var returnValue = recursiveKingSafe(row + k, col + t);
                    if(returnValue) {
                        return 'burst';
                    }
                }
            }
            
        }
        catch(err) {
            
        }
        
        l = -k;
        k = t;
        t = l;
    }
    
    return '';
};

var attackOpponentKing = function(row, col) {
    var currentCell  = completeChainData[row][col];
    var currentCellCount = currentCell.count;
    isVisited();
    completeChainData[row][col].isVisited = true;
    recursiveAttackKing(row, col);
};

var updateCoins = function() {
    var swapMove = 'KingMove'+initialData.player;
    debugger;
    //set initial priority..
    var maxCellID = 0;
    var maxPriority = 0;
    var isKingDanger = '';
    var isSwap = false;
    var swapData = '';
    
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            completeChainData[i][j].priority = 0;            
        }
    }
    
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            
            
            var tempCell = completeChainData[i][j];
            
            
            if(tempCell.owner === initialData.opponent && tempCell.coin.toUpperCase() === 'K') {
                attackOpponentKing(i, j);
            }
            else if(tempCell.owner === initialData.opponent) {
                tempCell.priority += -10;
            } else if(tempCell.owner === initialData.player && tempCell.coin.toUpperCase() === 'K') {
                if(initialData[swapMove] > 0) {
                    isKingDanger = isKingSafe(i, j);      
                    if(isKingDanger.toUpperCase() === 'DOSWAP') {
                        swapData = doswap(tempCell);
                        if(swapData) {
                            isSwap = true;                        
                        }
                        else {
                            tempCell.priority += -600;
                        }
                    }
                }
                // TODO comment
                tempCell.priority += -10;
            } else {
                protectKing(i, j);
                findEqualOpponentsNeighBours(i, j);
                isBurstPossibe(i,j);
            }
            
            
        }
    }
    
    for(var i=0; i<7;++i) {
        for(var j=0; j<7; ++j) {
            console.log(completeChainData[i][j].priority);
            if(completeChainData[i][j].priority > maxPriority) {
                maxPriority = completeChainData[i][j].priority;
                maxCellID = completeChainData[i][j].cellNumber;
            }
        }
    }
    console.log(maxPriority,maxCellID);
    if(isSwap) {
        return swapData;
    }
    return maxCellID;
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
        if(typeof coinPosition === 'number') {
            console.log(coinPosition);
            return ('C '+coinPosition);
        }
        else {
            console.log(coinPosition);
            return ('S '+coinPosition);
        }
        
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
