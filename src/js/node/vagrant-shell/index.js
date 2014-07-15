var spawn = require('child_process').spawn,
    which = require('which'),
    events = require('events'),
    util = require('util');

function VagrantShell() {
    var me = this;

    this._bin = null;

    this._parseVersion = function(str) {
        var v = str.match(/\d+\.\d+\.\d+/g);
        if(v) {
            return v.pop();
        }else{
            return false;
        }
    };
}

VagrantShell.prototype = new events.EventEmitter;

VagrantShell.prototype.bin = function() {
    if(!this._bin) {
        try {
            this._bin = which.sync('vagrant');
        } catch (e) {
            throw("vagrant command not found in your PATH");
        }
    }

    return this._bin;
};

VagrantShell.prototype.shell = function(cmd, args, out) {
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

VagrantShell.prototype.exec = function(args, cb) {
    this.shell(this.bin(), args, cb);
};

VagrantShell.prototype.emitTest = function() {
    this.emit('ready');
};

VagrantShell.prototype.init = function() {
    var me = this;

    v.exec(['-v'], function(r) {
        me.version = me._parseVersion(r);
        me.emit('ready');
    });
};

var v = new VagrantShell();

v.init();

module.exports = v;