var express = require('express');
var app = express();
var signature = require('wx_jsapi_sign'); // 引入主要模块 wx_jsapi_sign
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var fs = require('fs');
var template = require('art-template'); //模板引擎，用于返回 signature 参数到 html 页面
var config = require('./config')();

template.config('base', '');
template.config('extname', '.html');
app.set('port', process.env.PORT || 1342);
app.engine('.html', template.__express);
app.set('views', path.join(__dirname, './public'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', function(req, res) {
    var u = req.protocol + "://" + req.get('Host') + req.url;
    signature.getSignature(config)(u, function(error, result) {
        console.log(result);
        res.render('test.html', result);
    });
});

app.post('/getsignature', function(req, res){
    var url = req.body.url;
    console.log(url);
    signature.getSignature(config)(url, function(error, result) {
        if (error) {
            res.json({
                'error': error
            });
        } else {
            res.json(result);
        }
    });
});

app.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});