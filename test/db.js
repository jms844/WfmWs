var db = require('../config/db');
var assert = require('assert');

describe('db',function(){
    it('Should be username of s_sfuser',function(){
        assert.equal(db.WfmServer.user,'s_sfuser');
    });
    it('Should be name of the database of WfmData',function(){
        assert.equal(db.WfmServer.database,'WfmData');
    });
    it('Should be name of the server of SQLINFWWDVP01',function(){
        assert.equal(db.WfmServer.server,'SQLINFWWDVP01');
    });
});