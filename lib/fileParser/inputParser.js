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

        }
        else if (i === 1) {
            if(indValue.toLowerCase() === config.teamName.toLowerCase()) {
                initial.player = 1;
                initial.opponent = 2;
            }
            else {
                initial.player = 2;
                initial.opponent = 1;
            }
        } else {
            //do nothing
        }

    }
    return;
};

var findMaxCapcity = function(key) {
    var capcityOne = [1,7,43,49];
    var capcityTwo = [2,3,4,5,6,8,15,22,29,36,14,21,28,35,42,44,45,46,47,48];
    if(key <= 49 && key >= 1){
        if(capcityOne.indexOf(key) !== -1) {
            return 1;
        } else if(capcityTwo.indexOf(key) !== -1){
            return 2;
        } else {
            return 3;
        }
    } else {
        console.error('invalid Key......');
        alert('invalid Key......');
    }
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

        //find the maxCapacity of a cell..

        var capacity = findMaxCapcity(parseInt(indKey));

        completeChainData[row][col] = {
            owner: parseInt(coinData[0]),
            coin: coinData[1],
            count: parseInt(coinData[2]),
            maxCap: capacity,
            cellNumber: parseInt(indKey)
        };
    }

};

module.exports.parseInitial = parseInitial;
module.exports.parseMoves = parseMoves;
module.exports.initialData =  initial;
module.exports.completeChainData =  completeChainData;
