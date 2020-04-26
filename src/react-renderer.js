var fs = require('fs');
var path = require('path');

import React from 'react';
var { renderToString } = require('react-dom/server');

var { BUILD_DIR } = require('./paths');
var App = require('../../exshop/lib/App').default;

function reactRenderer(req, res) {
    var app = renderToString(<App />); 
    var html = fs
        .readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8')
        .replace('__ROOT__', app);
        
    return res.send(html);
};

module.exports = reactRenderer;