const sql = require('mssql');
const config = require('../config/db');

const eWfmDataPromise = new sql.ConnectionPool(config.eWfmServer)
    .connect()
    .then(pool => {
        console.log('Connected to eWfm');
        return pool;
    })
    .catch(err => console.log('eWfm connection failed! Bad config.'))

var closeConnection = async function(){
    const eWfmPool = await eWfmDataPromise;
    eWfmPool.close();
}

module.exports = {
    wfmDataPool,closeConnection
}