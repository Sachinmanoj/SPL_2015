var fs = require('fs');
var path = require('path');
var q = require('q');

var errStatus, teamDir, data;

var initFilePaths = function(path) {
    teamDir = path;
};

var fileRead = function(fileName,iteration) {
    try {
        var loc = path.join(teamDir,fileName+iteration+'.txt');
        data = fs.readFileSync(loc,'utf8').toString();
        return data;        
    } catch (e) {
        console.error(e);
    }
};

var fileWrite = function(fileName,data) {
    var defer = q.defer();
    var loc = path.join(teamDir,fileName);
    fs.writeFile(loc,data,'utf8',function(errStatus) {
        if(errStatus) {
            console.error(e);
            defer.reject(e);
        } else {
            defer.resolve();
        }
    });
    return defer.promise;
};

var createReadyFile = function() {
    return fileWrite('ready.txt','ready');
};

var isFileExists = function(fileName, iter) {
    var defer = q.defer();
    fileName = fileName+iter+'.txt';
    var loc = path.resolve(path.join(teamDir,fileName));
    
    fs.exists(loc,function(status) {
        defer.resolve(status);
    });
    return defer.promise;
};



module.exports.fileRead = fileRead;
module.exports.createReadyFile = createReadyFile;
module.exports.initFilePaths = initFilePaths;
module.exports.isFileExists = isFileExists;