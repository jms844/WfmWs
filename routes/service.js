var express = require('express');
var router = express.router;

router.get('/', function(req, res, next){
    res.render('service', {title: 'Service'});
});