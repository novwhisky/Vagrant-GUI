var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var which = require('which'),
    events = require('events'),
    semver = require('semver'),
    util = require('util');

function VagrantShell() {
    // super
    events.EventEmitter.call(this);
}

util.inherits(VagrantShell, events.EventEmitter);

VagrantShell.prototype._init = function() {
    this._addListeners();
    this._checkBin();

    this.STATUS_INTERVAL = 5000;
};

VagrantShell.prototype._checkBin = function() {
    var check = which.sync('vagrant');

    if(check) {
        this._bin = check;

        //check the version
        var ver = spawn(this._bin, ['-v']);

        ver.stdout.on('data', function(data) {
            var vnum = data.toString().trim().match(/[\d\.]+$/);
            if(vnum && semver.gte(vnum[0], '1.6.3')) {
                vs.version = vnum[0];
                vs.emit('ready');
            } else {
                vs.emit('error', new Error("Requires Vagrant 1.6 or higher"))
            }
        });

        ver.on('error', function(err) {
            vs.emit(err);
        })
    } else
        vs.emit(new Error("Unable to find Vagrant"));
};

VagrantShell.prototype._addListeners = function() {
    this.once('ready', function(data) {
        //setInterval(vs._pollStatus, vs.STATUS_INTERVAL);
        vs._pollStatus();
    });
};

VagrantShell.prototype.exec = function(args, cb) {
    var argStr = " " + args.join(" ");
    exec(vs._bin + argStr, cb);
};

/**
 * Space-separated list of VMs. Columns as follows:
 * id       name    provider   state    directory
 * -------------------------------------------------------------------------
 */
VagrantShell.prototype._pollStatus = function() {
    vs.exec(["global-status"], function(err, data) {
        // splice off global-status header
        var rows = data.toString().split("\n").slice(2),
            latch = false;

        rows.forEach(function(v, idx, arr) {
            var row = v.trim(),
                boxArgs = [];

            // Check that row begins with id hash
            if(latch || /^[0-9A-F]+/i.test(row) === false) {
                arr.splice(idx, arr.length - idx);
                latch = true;
            }else{
                row = row.split(/\s+/);

                // shift box id from beginning
                boxArgs = boxArgs.concat(row.splice(0, 1));

                // remaining params after name
                var remainder = row.splice(-3, 3);

                // put it all back together
                boxArgs = boxArgs.concat(row.join(" "), remainder);

                // And finally construct
                arr[idx] = VagrantBox.apply(null, boxArgs);
            }
        });

        vs.emit('status', rows);
    });
};




function VagrantBox(id, name, provider, state, directory) {
    if(! (this instanceof VagrantBox)) {
        return new VagrantBox(id, name, provider, state, directory);
    }

    this.id = id;
    this.name = name;
    this.state = state;
    this.provider = provider;
    this.directory = directory;
}

VagrantBox.prototype.toString = function() {
    return "VagrantBox " + this.id;
};

VagrantBox.prototype.up = function() {
    vs.exec(["up", this.id], function(err, data) {

    })
};

VagrantBox.prototype.halt = function() {
    vs.exec(["halt", this.id], function(err, data) {

    })};





var vs = new VagrantShell();
vs._init();

module.exports = vs;