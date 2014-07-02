var vagrant = require('./vagrant-shell'),
    semver = require('semver');

//console.log(vagrant.version);

if(vagrant.version && semver.gte(vagrant.version, '1.6.0')) {
    // Good 2 go
}else{
    // Doesn't support global-status
    //throw new Error("Install the latest version of Vagrant");
}