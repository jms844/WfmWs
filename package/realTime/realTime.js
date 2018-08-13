const sql01 = require("mssql");
const sql03 = require("msnodesqlv8");

const config01 = {
  user: "s_sfuser",
  password: "spotfire",
  server: "SQLINFWWDVP01\\DCPRD01",
  database: "WfmData"
};
const config03 = {
  driver: "msnodesqlv8",
  connectionString:
    "Driver={SQL Server Native Client 11.0};Server={SQLINFWWDVP03\\DCPRD03};Database={Avaya_ECH};Uid={s_workforceuser};Pwd={Frontier1};Trusted_Connection={yes};"
};

const realTimeQuery =
  "Select *,Cast(vendorID as varchar) + '_' + Cast(ACD as varchar) + '_' + Cast(SPLITNUM as varchar) splitKey From (Select     sld.*    ,Case        When sld.SPLITNUM BETWEEN 3900 AND 3999 THEN 4        WHEN sld.SPLITNUM BETWEEN 4600 AND 4699 THEN 3        ELSE 1    end vendorID From    vw_C_Split_LatestDay sld    Join (        Select            ACD,            SPLITNUM,            CMS,            MAX(LOADDATE) LOADDATE        FROM            vw_C_Split_LatestDay            Where LOADDATE >= Dateadd(MI,-5,GETDATE())        GROUP BY            ACD,            SPLITNUM,            CMS    ) ld        on sld.ACD = ld.ACD        and sld.SPLITNUM = ld.SPLITNUM        and sld.CMS = ld.CMS        and sld.LOADDATE = ld.LOADDATE) mySrc";
const mergeQuery =
  "Merge into C_Split_Latest_Day dst Using (Values @values) " +
  "src (ACD,SPLITNUM,SPLITNAME,INQUEUE_INRING,OLDESTCALL,CALLSOFFERED,ACCEPTABLE,ACDCALLS,ABNCALLS,STAFFED,AVAILABLE,ONACD,INACW,INAUX,ACDTIME,ANSTIME,ACWTIME,ABNTIME,HOLDTIME,AVG_ANSWER_SPEED,PERCENT_SERV_LVL_SPL,LOADDATE,CMS,vendorID,splitKey) " +
  "on dst.ACD = src.ACD and dst.SPLITNUM = src.SPLITNUM and dst.LOADDATE = src.LOADDATE and dst.CMS = src.CMS and dst.vendorID = src.vendorID " +
  "When matched then update	set " +
  "dst.INQUEUE_INRING = src.INQUEUE_INRING,dst.OLDESTCALL = src.OLDESTCALL,dst.CALLSOFFERED = src.CALLSOFFERED,dst.ACCEPTABLE = src.ACCEPTABLE,dst.ACDCALLS = src.ACDCALLS,dst.ABNCALLS = src.ABNCALLS,dst.STAFFED = src.STAFFED,dst.AVAILABLE = src.AVAILABLE,dst.ONACD = src.ONACD,dst.INACW = src.INACW,dst.INAUX = src.INAUX,dst.ACDTIME = src.ACDTIME,dst.ANSTIME = src.ANSTIME,dst.ACWTIME = src.ACWTIME,dst.ABNTIME = src.ABNTIME,dst.HOLDTIME = src.HOLDTIME,dst.AVG_ANSWER_SPEED = src.AVG_ANSWER_SPEED,dst.PERCENT_SERV_LVL_SPL = src.PERCENT_SERV_LVL_SPL " +
  "When not matched then insert " +
  "(ACD,SPLITNUM,SPLITNAME,INQUEUE_INRING,OLDESTCALL,CALLSOFFERED,ACCEPTABLE,ACDCALLS,ABNCALLS,STAFFED,AVAILABLE,ONACD,INACW,INAUX,ACDTIME,ANSTIME,ACWTIME,ABNTIME,HOLDTIME,AVG_ANSWER_SPEED,PERCENT_SERV_LVL_SPL,LOADDATE,CMS,vendorID,splitKey) " +
  "Values(src.ACD,src.SPLITNUM,src.SPLITNAME,src.INQUEUE_INRING,src.OLDESTCALL,src.CALLSOFFERED,src.ACCEPTABLE,src.ACDCALLS,src.ABNCALLS,src.STAFFED,src.AVAILABLE,src.ONACD,src.INACW,src.INAUX,src.ACDTIME,src.ANSTIME,src.ACWTIME,src.ABNTIME,src.HOLDTIME,src.AVG_ANSWER_SPEED,src.PERCENT_SERV_LVL_SPL,src.LOADDATE,src.CMS,src.vendorID,src.splitKey) " +
  ";";

const bufferSize = 50;

var getSplitRealTime = function() {
  sql03.query(config03.connectionString, realTimeQuery, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    }
    mergeRealTimeData(result);
  });
};
const pool = new sql01.ConnectionPool(config01);
pool.connect().then(() => {
  pool.request().query("Delete From C_Split_Latest_Day", () => {
    getSplitRealTime();
  });
});
// getTest01();

var mergeRealTimeData = function(data) {
  let values = "";
  for (let i = 0; i < Math.min(data.length, bufferSize); i++) {
    values += formatRealTimeData(data[i]) + ",";
  }
  values = values.substr(0, values.length - 1);
  const newMergeQuery = mergeQuery.replace("@values", values);
  // console.log(newMergeQuery);
  pool.request().query(newMergeQuery, (err, result) => {
    if (err) {
      console.log(err);
      console.log("Error in merging real time data");
      throw err;
    }
    if (data.length > bufferSize) {
      try {
        mergeRealTimeData(data.slice(bufferSize, data.length));
      } catch (err) {
        console.log(err);
      }
    } else {
      process.exit(0);
    }
  });
};

var formatRealTimeData = function(data) {
  let result = "(";
  for (let prop in data) {
    if (typeof data[prop] === "number") {
      result += data[prop];
    } else if (typeof data[prop] === "string") {
      result += "'" + data[prop] + "'";
    } else if (typeof data[prop] === "object") {
      if (data[prop] === null) {
        result += "0";
      } else {
        let newDate = new Date(data[prop]);
        result += "'" + newDate.toJSON() + "'";
      }
    }
    result += ",";
  }
  result = result.substr(0, result.length - 1);
  result += ")";
  // console.log(result);
  return result;
};
