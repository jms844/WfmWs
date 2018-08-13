const sql = require("mssql/msnodesqlv8");
const config = require("../config/db");

const avayaEchPromise = new sql.ConnectionPool(config.avayaEch)
  .connect()
  .then(pool => {
    console.log("Connected to Avaya_ECH");
    return pool;
  })
  .catch(err => console.log("Avaya_ECH connection failed! Bad config."));

var closeConnection = async function(callback) {
  const pool = await avayaEchPromise;
  pool.close();
  callback();
};

module.exports = {
  avayaEchPromise,
  closeConnection
};
