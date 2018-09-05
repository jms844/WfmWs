const sql01 = require('mssql');
const sql59 = require('msnodesqlv8');

const config01 = {
  user: 's_sfuser',
  password: 'spotfire',
  server: 'SQLINFWWDVP01\\DCPRD01',
  database: 'WfmData'
};
const config59 = {
  user: 'Workforceuser',
  password: 'Frontier1',
  server: 'SQLINFWWDVP59\\DCPRD59',
  database: 'WFM'
};

const ilamQuery =
  "Select Cast(DATEADD(MI,SOD.START_MOMENT - TZD.BIAS_MI,'12/30/1899') as date) soDate ,Cast(DATEADD(MI,SOD.START_MOMENT - TZD.BIAS_MI,'12/30/1899') as Time(0)) soTime,SOS.STF_GRP_SK,SOD.STF,Cast(GETDATE() as datetime2(0)) currentTime From STF_OVRD_DET SOD JOIN STF_OVRD_SET SOS 	ON SOD.STF_OVRD_SET_SK = SOS.STF_OVRD_SET_SK JOIN STF_GRP SG ON SOS.STF_GRP_SK = SG.STF_GRP_SK JOIN TIME_ZONE_DET TZD ON SG.TIME_ZONE_SK = TZD.TIME_ZONE_SK AND DATEADD(MI,SOD.START_MOMENT,'12/30/1899') BETWEEN TZD.START_TS AND TZD.STOP_TS WHERE SOS.CODE LIKE '%ILAM%'";

const postIlamQuery =
  'Insert into stg.IlamReq(soDate, soTime, STF_GRP_SK, STF, [Updated]) Values @values';

function getIlamData(callback) {
  const pool59 = new sql01.ConnectionPool(config59, err => {
    pool59.request().query(ilamQuery, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      callback(result.recordset);
      pool59.close();
    });
  });
}
getIlamData(postIlamData);

async function postIlamData(result) {
  const pool01 = await new sql01.ConnectionPool(config01);
  await pool01.connect();
  await pool01.request().query('Delete from stg.IlamReq');
  let valuesList = [];
  for (j = 0; j < result.length; j += 100) {
    let values = '';
    let newResults = result.slice(j, j + 100);
    for (let i = 0; i < newResults.length; i++) {
      // console.log(result[i]);
      values += '(';
      values += formatInput(newResults[i].soDate) + ',';
      values += formatInput(newResults[i].soTime) + ',';
      values += formatInput(newResults[i].STF_GRP_SK) + ',';
      values += formatInput(newResults[i].STF) + ',';
      values += formatInput(newResults[i].currentTime);
      values += ')';
      if (i + 1 < newResults.length) {
        values += ',';
      }
    }
    const piq = postIlamQuery.replace('@values', values);
    valuesList.push(piq);
  }
  // console.log(values);
  for (let i = 0; i < valuesList.length; i++) {
    console.log(i);
    let successful = await pool01.request().query(valuesList[i]);
  }
  let merged = await pool01.request().query('exec stg.spIlamReq');
  pool01.close();
}

function formatInput(input) {
  if (typeof input == 'number') {
    return input;
  } else if (typeof input == 'object') {
    return "'" + input.toISOString() + "'";
  } else {
    // console.log(typeof input);
    return input;
  }
}

// console.log(typeof getIlamData());
// getIlamData().then(result => {
//   console.log(result);
// });

/*
const pool = new sql01.ConnectionPool(config01, err => {
  if (err) {
    console.log('Error connecting to 01');
    return;
  }
  // console.log('Connected to 01');
  pool.request().query('Select * from vDimVendor', (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    pool.close();
  });
});
*/
