const wfmDataConnection = require('../db/WfmData');
const sql = require('mssql');

const deptQuery = 'Select * from dimDept';
const oneDeptQuery = 'Select * from vDimDept Where deptID = @deptID';
const addDeptQuery = 'Insert into dimDept(deptName,deptAbbr,deptImage) Values(@deptName,@deptAbbr,@deptImage)';
const updateDeptQuery = 'Update dimDept Set deptName = @deptName, deptAbbr = @deptAbbr, deptImage = @deptImage Where deptID = @deptID';
const deleteDeptQuery = 'Delete from dimDept Where deptID = @deptID';

var getDepts = async function(callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .query(deptQuery, (err, result) => {
            if(err){
                console.log('Error pulling Depts');
                throw err;
            }
            callback(result.recordset);
        });
}

var getDept = async function(deptID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('deptID',sql.TinyInt, deptID)
        .query(oneDeptQuery, (err, result) => {
            if(err) throw err;
            callback(result.recordset[0]);
        });
}

var addDept = async function(dept, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('deptName',dept.deptName)
        .input('deptAbbr',dept.deptAbbr)
        .input('deptImage',dept.deptImage)
        .query(addDeptQuery,(err, result) =>{
            if(err) throw err;
            callback(dept);
        });
}

var updateDept = async function(dept, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('deptName',dept.deptName)
        .input('deptAbbr',dept.deptAbbr)
        .input('deptImage',dept.deptImage)
        .input('deptID', dept.deptID)
        .query(updateDeptQuery,(err, result) =>{
            if(err) throw err;
            callback(dept);
        });
}

var deleteDept = async function(deptID, callback){
    const pool = await wfmDataConnection.wfmDataPromise;
    pool.request()
        .input('deptID',deptID)
        .query(deleteDeptQuery, (err, result) => {
            if(err) throw err;
            callback(null);
        });
}
module.exports = {
    getDepts, getDept, addDept, updateDept, deleteDept
}