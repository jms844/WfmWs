const sql = require("mssql");
const config = require("../config/db");

const wfmDataPromise = new sql.ConnectionPool(config.WfmServer)
  .connect()
  .then(pool => {
    console.log("Connected to WfmData");
    return pool;
  })
  .catch(err => console.log("WfmData connection failed! Bad config."));

var closeConnection = async function(callback) {
  const pool = await wfmDataPromise;
  pool.close();
  callback();
};

module.exports = {
  wfmDataPromise,
  closeConnection
};
