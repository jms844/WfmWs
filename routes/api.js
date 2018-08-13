var express = require('express');
var router = express.Router();
var serviceFactory = require('../factory/service');
var deptFactory = require('../factory/dept');
var lobFactory = require('../factory/lob');
var languageFactory = require('../factory/language');
var legacyFactory = require('../factory/legacy');
const vendorFactory = require('../factory/vendor');

// Main api
router.get('/', function(req, res, next){
    res.render('index', {title: 'api'});
});

// Get All services
router.get('/service', function(req, res, next){
    serviceFactory.getServices(function(result){
        res.json(result);
    });
});
//Get service with specified ID
router.get('/service/:id', function(req, res, next){
    var serviceID = req.params.id;
    serviceFactory.getService(serviceID, function(result){
        res.json(result);
    });
});
// Add a new service.
router.post('/service', function(req, res, next){
    var service = req.body;
    serviceFactory.addService(service, function(result){
        console.log('Added service: ' + service);
        res.json(service);
    });
})
// Update a service
router.put('/service', function(req,res,next){
    var service = req.body;
    serviceFactory.updateService(service, function(result){
        console.log('Updated Service: ' + service);
        res.json(service);
    });
});

router.get('/dept', function(req, res, next){
    deptFactory.getDepts(function(result){
        res.json(result);
    });
});

router.get('/dept/:id', function(req, res, next){
    var deptID = req.params.id;
    deptFactory.getDept(deptID, function(result){
        res.json(result);
    });
});

router.post('/dept', function(req, res, next){
    var dept = req.body;
    deptFactory.addDept(dept, function(result){
        console.log('Added dept: ' + dept);
        res.json(dept);
    });
})

router.put('/dept', function(req,res,next){
    var dept = req.body;
    deptFactory.updateDept(dept, function(result){
        console.log('Updated Dept: ' + dept);
        res.json(dept);
    });
})

router.get('/lob', function(req, res, next){
    lobFactory.getLobs(function(result){
        res.json(result);
    });
});

router.get('/lob/:id', function(req, res, next){
    var lobID = req.params.id;
    lobFactory.getLob(lobID, function(result){
        res.json(result);
    });
});

router.post('/lob', function(req, res, next){
    var lob = req.body;
    lobFactory.addLob(lob, function(result){
        console.log('Added lob: ' + lob);
        res.json(lob);
    });
})

router.put('/lob', function(req,res,next){
    var lob = req.body;
    lobFactory.updateLob(lob, function(result){
        console.log('Updated Lob: ' + lob);
        res.json(lob);
    });
})

router.get('/language', function(req, res, next){
    languageFactory.getLanguages(function(result){
        res.json(result);
    });
});

router.get('/language/:id', function(req, res, next){
    var languageID = req.params.id;
    languageFactory.getLanguage(languageID, function(result){
        res.json(result);
    });
});

router.post('/language', function(req, res, next){
    var language = req.body;
    languageFactory.addLanguage(language, function(result){
        console.log('Added language: ' + language);
        res.json(language);
    });
})

router.put('/language', function(req,res,next){
    var language = req.body;
    languageFactory.updateLanguage(language, function(result){
        console.log('Updated Language: ' + language);
        res.json(language);
    });
})

router.get('/legacy', function(req, res, next){
    legacyFactory.getLegacys(function(result){
        res.json(result);
    });
});

router.get('/legacy/:id', function(req, res, next){
    var legacyID = req.params.id;
    legacyFactory.getLegacy(legacyID, function(result){
        res.json(result);
    });
});

router.post('/legacy', function(req, res, next){
    var legacy = req.body;
    legacyFactory.addLegacy(legacy, function(result){
        console.log('Added legacy: ' + legacy);
        res.json(legacy);
    });
})

router.put('/legacy', function(req,res,next){
    var legacy = req.body;
    legacyFactory.updateLegacy(legacy, function(result){
        console.log('Updated Legacy: ' + legacy);
        res.json(legacy);
    });
})

router.get('/vendor', function(req, res, next){
    vendorFactory.getVendors(function(result){
        res.json(result);
    });
});

router.get('/vendor/:id', function(req, res, next){
    var vendorID = req.params.id;
    vendorFactory.getVendor(vendorID, function(result){
        res.json(result);
    });
});

router.post('/vendor', function(req, res, next){
    var vendor = req.body;
    vendorFactory.addVendor(vendor, function(result){
        console.log('Added vendor: ' + vendor);
        res.json(vendor);
    });
})

router.put('/vendor', function(req,res,next){
    var vendor = req.body;
    vendorFactory.updateVendor(vendor, function(result){
        console.log('Updated Vendor: ' + vendor);
        res.json(vendor);
    });
})

module.exports = router;