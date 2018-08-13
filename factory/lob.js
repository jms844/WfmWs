const wfmDataConnection = require('../db/WfmData');
const sql = require('mssql');

const lobQuery = 'Select * from dimLob';
const oneLobQuery = 'Select * from vDimLob Where lobID = @lobID';
const addLobQuery = 'Insert into dimLob(lobName,lobAbbr,lobImage) Values(@lobName,@lobAbbr,@lobImage)';
const updateLobQuery = 'Update dimLob Set lobName = @lobName, lobAbbr = @lobAbbr, lobImage = @lobImage Where lobID = @lobID';
const deleteLobQuery = 'Delete from dimLob Where lobID = @lobID';

var getLobs = async function(callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .query(lobQuery, (err, result) => {
            if(err){
                console.log('Error pulling Lobs');
                throw err;
            }
            callback(result.recordset);
        });
}

var getLob = async function(lobID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('lobID',sql.TinyInt, lobID)
        .query(oneLobQuery, (err, result) => {
            if(err) throw err;
            callback(result.recordset[0]);
        });
}

var addLob = async function(lob, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('lobName',lob.lobName)
        .input('lobAbbr',lob.lobAbbr)
        .input('lobImage',lob.lobImage)
        .query(addLobQuery,(err, result) =>{
            if(err) throw err;
            callback(lob);
        });
}

var updateLob = async function(lob, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('lobName',lob.lobName)
        .input('lobAbbr',lob.lobAbbr)
        .input('lobImage',lob.lobImage)
        .input('lobID', lob.lobID)
        .query(updateLobQuery,(err, result) =>{
            if(err) throw err;
            callback(lob);
        });
}

var deleteLob = async function(lobID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('lobID',lobID)
        .query(deleteLobQuery, (err, result) => {
            if(err) throw err;
            callback(null);
        });
}
module.exports = {
    getLobs, getLob, addLob, updateLob, deleteLob
}