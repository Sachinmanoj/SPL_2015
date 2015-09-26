function asyncLoop(func, callback) {
    var done = false;
    var loop = {
        next: function() {
            if (done) {
                return;
            }

            func(loop); 
            
        },

        break: function() {
            done = true;
            callback();
        }
    };
    loop.next();
    return loop;
}

module.exports = asyncLoop;