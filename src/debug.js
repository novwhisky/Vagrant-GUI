var vagrant = require('./js/node/vagrant-shell');

vagrant.on('ready', function() {
    console.log(vagrant);
});