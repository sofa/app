'use strict';

var express = require('express');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');
var config = require('../build.config');

// Load available routes
var routes = {};
var routePath = './routes/';

routes['products'] = require(routePath + 'products');
routes['search'] = require(routePath + 'search');
routes['states'] = require(routePath + 'states');
routes['checkout/ajax.php'] = require(routePath + 'checkout');
routes['checkout/summaryst.php'] = require(routePath + 'summary');
routes['checkout/docheckoutst.php'] = require(routePath + 'docheckoutst');
routes['checkout/summaryfin.php'] = require(routePath + 'summaryfin');

// Allow all hosts so this server could be run on a remote location
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies

// Utilize the route we requested
app.use(function (req, res, next) {
    var parsedUrl = url.parse(req.originalUrl, true);
    var target = parsedUrl.pathname.substr(1);

    if (routes[target]) {
        routes[target](req, res, next, parsedUrl.query);
    }
    else {
        next();
    }
});

// Static host the media and app data folder
app.use('/media', express.static(__dirname + '/media/'));
app.use('/data', express.static(__dirname + '/../data/local/'));

app.listen(config.server_port); /* jshint ignore:line */
