(function () {
    
    //start the process..
    var fs = require('fs');
    var path = require('path');
    var cwd = process.cwd();
    var config = require(path.join(cwd,'config.json'));
    var fileOperation = require(path.join(cwd,'lib/fileParser/fileOperation.js'));
    var loopAsync = require(path.join(cwd,'lib/loopAsync.js'));
    var inputParser = require(path.join(cwd,'lib/fileParser/inputParser.js'));
    var logicDecider = require(path.join(cwd,'lib/logic/logicalDecider.js'));
    
    var iteration = 1;
    var isGameOver = false;
    var inputFileName = 'input_';
    var outputFileName = 'output_';
    var ackFileNAme = 'acknowledge_';
    var gameoverFileName = 'gameover';
    var teamFolder;
    
//    var pause = function(ms) {
//        var dt = new Date();
//        while((new Date()) - dt <= ms) {
//            //do nothing
//        }
//        return;
//    };
    
    var rmdir = function(dir) {
        var list = fs.readdirSync(dir);
        for(var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);

            if(filename == "." || filename == "..") {
                // pass these files
            } else if(stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm fiilename
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    };

    var createTeamFolderOnInit = function (teamName, splLocation) {
        
        splLocation = path.resolve(splLocation);
        
        teamFolder = path.join(splLocation, teamName);
        
        //check splLocation exists if exists remove it
        if (fs.existsSync(teamFolder)) {
            rmdir(teamFolder);
            console.log('folder deleted..',teamFolder);
        }
        //create directory
        fs.mkdirSync(teamFolder);
        console.log('folder created..',teamFolder);
    };
    
    var inputContents, inputPath, expected, inputObj, opData, ackContents;

    var startProcess = function() {
        //create folder on init..
        createTeamFolderOnInit(config.teamName, config.splLocation);
        fileOperation.initFilePaths(teamFolder);
        
        var doChainReaction = function(loop) {
            
            var continueChainReaction = function() {
                ++iteration; 
                loop.next();
            };
            
            var getAckFile = function(nestedLoopOne) {
                fileOperation.isFileExists(ackFileNAme,iteration).then(function(exists){
                   if(exists) {
                       //wait for 200 ms
                       setTimeout(function() {
                           ackContents = fileOperation.fileRead(ackFileNAme,iteration);
                           logicDecider.processErrorCode(ackContents);
                           nestedLoopOne.break();
                       },200);
                   } else {
                       nestedLoopOne.next();
                   }
                });
            };
            
          //wait for 10 ms
          setTimeout(function() {
              //write ready file
            fileOperation.createReadyFile().then(function() {
                fileOperation.isFileExists(inputFileName,iteration).then(function(status) {
                    if(status) {
                        console.info('input file found');
                        //read the contents of the input file..
                        inputContents = fileOperation.fileRead(inputFileName,iteration);
                        //parse First set of Data
                        inputParser.parseInitial(inputContents);
                        //parse second set of Data
//                        console.log(inputParser.initialData);
                        inputParser.parseMoves(inputContents);
//                        console.log(inputParser.completeChainData);
                        opData = logicDecider.findLogic(iteration);
                        fileOperation.fileWrite(outputFileName,iteration,opData);
                        loopAsync(getAckFile,continueChainReaction);
                    } else {
                        fileOperation.isFileExists(gameoverFileName,'').then(function(status) {
                            if(status) {
                                loop.break();
                            } else {
                                loop.next();
                            }
                    
                        },function(){
//                            loop.break();
                        });
                    }
                    
                },function(){
//                    loop.next();
                });
            },function(e){
                console.error(e);
                loop.next();
            });
            
          },10);
            
        };
        
        var exitProcess = function() {
            //close nwgui
            require('nw.gui').Window.get().close();
        };
                
        loopAsync(doChainReaction,exitProcess);
        
    };
    startProcess();
    
})();