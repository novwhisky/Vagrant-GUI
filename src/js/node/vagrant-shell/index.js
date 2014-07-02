var vagrant = require('vagrant'),
    spawn = require('child_process').spawn;

var shell = function(cmd, args, out) {
    var child = spawn(cmd, args),
        response = '';

    child.stdout.on('data', function(chunk) {
        response += chunk.toString();
    });

    child.on('close', function(code) {
        if(typeof out !== "undefined")
            out(response);
    });
};


vagrant.exec = function(args, cb) {
    shell(this.bin(), args, function(response) {
        cb(response);
    });
};

vagrant.exec(['-v'], function(response) {
    var ver;
    if(response) {
        ver = response.trim().match(/[\d\.]+$/).shift();
        vagrant.version = ver;
    }
});

// Map new object over
Object.keys(vagrant).forEach(function(v) {
    module.exports[v] = vagrant[v];
});