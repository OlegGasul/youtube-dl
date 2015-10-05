var Browser = require("zombie");
var amqp = require('amqplib/callback_api');

if (process.argv.length < 4) {
    process.stdout.write("Usage: [startUrl] [maxPages]\n");
    process.exit();
}

var startUrl = process.argv[2];
var maxPages = process.argv[3];


function pushLinks(links) {
    for (var i = 0; i < links.length; i++) {
        result.push(links[i]);
    }
}

function getLinks(url, callback) {
    new Browser({ debug: false, runScripts: false }).visit(url).then(function() {
        var error = browser.query('.yt-alert-message');
        if (error) {
            callback(error.innerHTML);
            return;
        }
        
        var links = browser.queryAll('.yt-uix-tile-link');
        var result = [];
        for (var i = 0; i < links.length; i++) {
            result.push(links[i].href);
        }

        callback(null, result);
    });
}

function visitPage(page) {
    getLinks(startUrl + '&page=' + page, function(err, result) {
        page++;
        if (page <= maxPages)
            visitPage(page);
    });
}

visitPage(1);
