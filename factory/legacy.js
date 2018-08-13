const wfmDataConnection = require('../db/WfmData');
const sql = require('mssql');

const legacyQuery = 'Select * from dimLegacy';
const oneLegacyQuery = 'Select * from vDimLegacy Where legacyID = @legacyID';
const addLegacyQuery = 'Insert into dimLegacy(legacyName) Values(@legacyName)';
const updateLegacyQuery = 'Update dimLegacy Set legacyName = @legacyName Where legacyID = @legacyID';
const deleteLegacyQuery = 'Delete from dimLegacy Where legacyID = @legacyID';

var getLegacys = async function(callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .query(legacyQuery, (err, result) => {
            if(err){
                console.log('Error pulling Legacys');
                throw err;
            }
            callback(result.recordset);
        });
}

var getLegacy = async function(legacyID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('legacyID',sql.TinyInt, legacyID)
        .query(oneLegacyQuery, (err, result) => {
            if(err) throw err;
            callback(result.recordset[0]);
        });
}

var addLegacy = async function(legacy, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('legacyName',legacy.legacyName)
        .query(addLegacyQuery,(err, result) =>{
            if(err) throw err;
            callback(legacy);
        });
}

var updateLegacy = async function(legacy, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('legacyName',legacy.legacyName)
        .input('legacyID', legacy.legacyID)
        .query(updateLegacyQuery,(err, result) =>{
            if(err) throw err;
            callback(legacy);
        });
}

var deleteLegacy = async function(legacyID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('legacyID',legacyID)
        .query(deleteLegacyQuery, (err, result) => {
            if(err) throw err;
            callback(null);
        });
}
module.exports = {
    getLegacys, getLegacy, addLegacy, updateLegacy, deleteLegacy
}