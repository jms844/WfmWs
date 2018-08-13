var express = require('express');
var router = express.Router();
var serviceFactory = require('../factory/service');

router.get('/', function(req, res, next){
    serviceFactory.getServices(function(result){
        res.json(result);
    })
});

module.exports = router;