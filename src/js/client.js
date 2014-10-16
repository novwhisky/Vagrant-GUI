var open = require('open');

$(document).ready(doInit);

function resize() {
    var container = $('.container'),
        hDiff = window.outerHeight - window.innerHeight;

    window.resizeTo(container.width(), container.height());
}

function addListeners() {
    var container = $('.container');

    vagrant.on('status', function(boxen) {

        container.empty();

        boxen.forEach(function(v) {
            var markup = jade.renderFile('src/views/box-status.jade', v);
            var entry = $(markup);

            // Add reference to VagrantBox instance
            entry.get(0).box = v;
            container.append(entry);
        });

        resize();

    });

    container.on('click', '.box .up', function(e) {
        var entry = $(this).parents('.box').get(0);
        entry.box.up();
    });

    container.on('click', '.box .halt', function(e) {
        var entry = $(this).parents('.box').get(0);
        entry.box.halt();
    });

    container.on('click', '.box .name, .box .id', function (e) {
        var entry = $(this).parents('.box').get(0);
        open(entry.box.directory);
    })

}

function doInit() {
    // Add event listeners, etc
    addListeners();
}