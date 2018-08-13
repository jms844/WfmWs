const sql = require('mssql');
const config = require('../config/db');

const wfmDataPool = new sql.ConnectionPool(config.WfmServer)
    .connect()
    .then(pool => {
        console.log('Connected to WfmData');
        return pool;
    })
    .catch(err => console.log('WfmData connection failed! Bad config.'))

const EwfmDataPool = new sql.ConnectionPool(config.eWfmServer)
    .connect()
    .then(pool => {
        console.log('Connected to Ewfm');
        return pool;
    })
    .catch(err => console.log('Ewfm connection failed! Bad config.'))

var closeConnection = async function(){
    const pool = await wfmDataPool;
    const eWfmPool = await EwfmDataPool;
    pool.close();
    eWfmPool.close();
}

module.exports = {
    sql, wfmDataPool, EwfmDataPool, closeConnection
}