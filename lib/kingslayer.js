(function () {
    
    //start the process..
    var fs = require('fs');
    var path = require('path');
    var cwd = process.cwd();
    var config = require(path.join(cwd,'config.json'));
    var fileOperation = require(path.join(cwd,'lib/fileParser/fileOperation.js'));
    var loopAsync = require(path.join(cwd,'lib/loopAsync.js'));
    
    var iteration = 0;
    var isGameOver = false;
    var inputFileName = 'input_';
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
    

    var startProcess = function() {
        //create folder on init..
        createTeamFolderOnInit(config.teamName, config.splLocation);
        fileOperation.initFilePaths(teamFolder);
        
        var doChainReaction = function(loop) {
            //wait for 10 ms
          setTimeout(function() {
              //write ready file
            fileOperation.createReadyFile().then(function() {
                fileOperation.isFileExists(inputFileName,iteration).then(function(status) {
                    if(status) {
                        console.info('input file found');
                            ++iteration; //TODO parse input file
                            loop.next();
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