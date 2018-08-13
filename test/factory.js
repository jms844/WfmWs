const serviceFactory = require('../factory/service');
const deptFactory = require('../factory/dept');
const lobFactory = require('../factory/lob');
const languageFactory = require('../factory/language');
const legacyFactory = require('../factory/legacy');
const vendorFactory = require('../factory/vendor');

const wfmDataConnection = require('../db/WfmData');

var assert = require('assert');
describe('Factories',function(){
    this.afterAll(function(){
        wfmDataConnection.closeConnection();
    });
    describe('ServiceFactory',function(){
        it('Should be the unknown Service',function(done){
            serviceFactory.getService(0,function(result){
                // console.log(result);
                assert.equal(result.serviceID,0);
                done();
            });
        });
        it('Should be the collections service',function(done){
            serviceFactory.getService(1,function(result){
                // console.log(result);
                assert.equal(result.serviceName,'Collections');
                done()
            });
        });
        it('Should be all of the services',function(done){
            serviceFactory.getServices(function(result){
                // console.log(result);
                assert.notEqual(result.length,0);
                done()
            });
        });
        it('Should not receive error when updating service',function(done){
            serviceFactory.updateService({"serviceID":0,"serviceName":"Unknown","serviceAbbr":"NA","serviceImage":null},function(result){
                // console.log(result);
                done()
            });
        });
    });
    describe('DeptFactory', function(){
        it('Should get all depts', function(){
            deptFactory.getDepts(function(result){
                assert.notEqual(result.length, 0);
                done();
            })
        });
        it('Should get the unknown dept', function(){
            deptFactory.getDept(0, function(result){
                assert.equal(result.deptID, 0);
                done();
            });
        });
        it('Should update dept without an error', function(){
            deptFactory.updateDept({"deptID":0,"deptName":"Unknown","deptAbbr":"NA","deptImage":null}, function(result){
                done();
            });
        });
    });
    describe('LobFactory', function(){
        it('Should get all lobs', function(){
            lobFactory.getLobs(function(result){
                assert.notEqual(result.length, 0);
                done();
            })
        });
        it('Should get the unknown lob', function(){
            lobFactory.getLob(0, function(result){
                assert.equal(result.lobID, 0);
                done();
            });
        });
        it('Should update lob without an error', function(){
            lobFactory.updateLob({"lobID":0,"lobName":"Unknown","lobAbbr":"NA","lobImage":null}, function(result){
                done();
            });
        });
    });
    describe('LanguageFactory', function(){
        it('Should get all languages', function(){
            languageFactory.getLanguages(function(result){
                assert.notEqual(result.length, 0);
                done();
            })
        });
        it('Should get the unknown language', function(){
            languageFactory.getLanguage(0, function(result){
                assert.equal(result.languageID, 0);
                done();
            });
        });
        it('Should update language without an error', function(){
            languageFactory.updateLanguage({"languageID":0,"languageName":"Unknown","languageAbbr":"NA"}, function(result){
                done();
            });
        });
    });
    describe('LegacyFactory', function(){
        it('Should get all legacys', function(){
            legacyFactory.getLegacys(function(result){
                assert.notEqual(result.length, 0);
                done();
            })
        });
        it('Should get the unknown legacy', function(){
            legacyFactory.getLegacy(0, function(result){
                assert.equal(result.legacyID, 0);
                done();
            });
        });
        it('Should update legacy without an error', function(){
            legacyFactory.updateLegacy({"legacyID":0,"legacyName":"Unknown"}, function(result){
                done();
            });
        });
    });

    describe('VendorFactory', function(){
        it('Should get all vendors', function(){
            vendorFactory.getVendors(function(result){
                assert.notEqual(result.length, 0);
                done();
            })
        });
        it('Should get the unknown vendor', function(){
            vendorFactory.getVendor(0, function(result){
                assert.equal(result.vendorID, 0);
                done();
            });
        });
        it('Should update vendor without an error', function(){
            vendorFactory.updateVendor({"vendorID":0,"vendorName":"Unallocated","vendorAbbr":"NA","vendorImage":null}, function(result){
                done();
            });
        });
    });
})

