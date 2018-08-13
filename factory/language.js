const wfmDataConnection = require('../db/WfmData');
const sql = require('mssql');

const languageQuery = 'Select * from dimLanguage';
const oneLanguageQuery = 'Select * from vDimLanguage Where languageID = @languageID';
const addLanguageQuery = 'Insert into dimLanguage(languageName,languageAbbr) Values(@languageName,@languageAbbr)';
const updateLanguageQuery = 'Update dimLanguage Set languageName = @languageName, languageAbbr = @languageAbbr Where languageID = @languageID';
const deleteLanguageQuery = 'Delete from dimLanguage Where languageID = @languageID';

var getLanguages = async function(callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .query(languageQuery, (err, result) => {
            if(err){
                console.log('Error pulling Languages');
                throw err;
            }
            callback(result.recordset);
        });
}

var getLanguage = async function(languageID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('languageID',sql.TinyInt, languageID)
        .query(oneLanguageQuery, (err, result) => {
            if(err) throw err;
            callback(result.recordset[0]);
        });
}

var addLanguage = async function(language, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('languageName',language.languageName)
        .input('languageAbbr',language.languageAbbr)
        .query(addLanguageQuery,(err, result) =>{
            if(err) throw err;
            callback(language);
        });
}

var updateLanguage = async function(language, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('languageName',language.languageName)
        .input('languageAbbr',language.languageAbbr)
        .input('languageID', language.languageID)
        .query(updateLanguageQuery,(err, result) =>{
            if(err) throw err;
            callback(language);
        });
}

var deleteLanguage = async function(languageID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('languageID',languageID)
        .query(deleteLanguageQuery, (err, result) => {
            if(err) throw err;
            callback(null);
        });
}
module.exports = {
    getLanguages, getLanguage, addLanguage, updateLanguage, deleteLanguage
}