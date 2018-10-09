/*   Set m_WFMHost, m_WFMDatabaseAlias, m_Username, and m_Password    according to your local configuration. 
 
  Your installation of the WFM web services MUST (!) be set to use BASIC authentication rather than FORM authentication. 
 
*/

const axios = require('axios');
const parseString = require('xml2js-parser').parseStringSync;
const sql = require('mssql');
const sqlConfig = require('../../config/db').WfmServer;

const axiosConfig = {
  headers: { 'Content-type': 'application/x-www-form-urlencoded' },
  auth: {
    username: 'corp\\s_workforceuser',
    password: 'Frontier1'
  }
};

// axios.defaults.headers.common['Content-type'] =
//   'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Authorization'] =
//   'Basic Y29ycFxzX3dvcmtmb3JjZXVzZXI6RnJvbnRpZXIx';

var m_WFMHost = 'ewfmweb.corp.pvt';
var m_WFMDatabaseAlias = 'WFMData';
var m_TimeoutValue = 480; // 8 minutes

const idpDetailsForGrp =
  '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">' +
  '	<IDP SK="@idpSk"/>' +
  '	<ForecastGroup SK="@fgsk">' +
  '		<Element ID="RVSFORVOL"/>' +
  '		<Element ID="ORGFORVOL"/>' +
  '		<Element ID="RVSFORAHT"/>' +
  '		<Element ID="ORGFORAHT"/>' +
  '		<Element ID="RVSCALCSRVCLEVPCT1"/>' +
  '		<Element ID="RVSCALCSRVCLEVPCT2"/>' +
  '	</ForecastGroup>' +
  '</IDPDetails>';

const idpDetailsStfGrp =
  '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">' +
  '	<IDP SK="@idpSk"/>' +
  '	<StaffGroup SK="@sgsk">' +
  '		<Element ID="STFRVSSCHSTFWOADJ"/>' +
  '		<Element ID="STFRVSSCHSTFWADJ"/>' +
  '		<Element ID="RVSREQSTF"/>' +
  '		<Element ID="STFRVSREQSTFWUNP"/>' +
  '	</StaffGroup>' +
  '</IDPDetails>';

const idpLookup =
  '<IDPLookup>' +
  '	<RoutingSet SK="@rssk"/>' +
  '	<DateTimeRange>' +
  '		<Start>@startDate</Start>' +
  '		<Stop>@stopDate</Stop>' +
  '	</DateTimeRange>' +
  '</IDPLookup>';

function PostURL(ServletName) {
  var result;
  result =
    'http://' +
    m_WFMHost +
    '/WFMWebSvcs/' +
    m_WFMDatabaseAlias +
    '/ENU/API/servlet/' +
    ServletName +
    '.ewfm';
  return result;
}

function PostBody(DataIn) {
  var result;
  result =
    'NoStyle=&NoErrorStyle=&' +
    'data_in=' +
    escape(DataIn) +
    '&Timeout=' +
    m_TimeoutValue;
  return result;
}

async function CallEWFMWebService(ServletName, DataIn) {
  var HTTPREQUEST_SETCREDENTIALS_FOR_SERVER = 0;
  var url = PostURL(ServletName);
  var body = PostBody(DataIn);
  try {
    let result = await axios.post(url, body, axiosConfig);
    let parsedResult = await parseString(result.data);
    return parsedResult;
  } catch (err) {
    throw err;
  }
}

// Get IDP List for routing set
async function getIdpList(rssk, prevDays, nextDays) {
  try {
    let startDate = addDays(prevDays);
    let stopDate = addDays(nextDays);
    let idpLookupXml = idpLookup
      .replace('@rssk', rssk)
      .replace('@startDate', startDate.toISOString())
      .replace('@stopDate', stopDate.toISOString());
    let idpList = await CallEWFMWebService('IDPLookup', idpLookupXml);
    return idpList;
  } catch (err) {
    throw err;
  }
}

// Returns date relative to todays date.
function addDays(days) {
  let newDate = new Date(new Date().valueOf() + days * 86400000);
  return newDate;
}

// Extracts the list of idps of a routing set into something more useable.
function getIdpListData(idpList) {
  if (typeof idpList.IDPs.IDP == 'undefined') {
    throw new Error('No IDPs listed');
  }
  let idps = idpList.IDPs.IDP;
  let idpDetails = {
    ForGrp: [],
    StfGrp: []
  };
  for (let i = 0; i < idps.length; i++) {
    let idp = idps[i];
    let idpSk = idp.$.SK;
    for (let j = 0; j < idp.ForecastGroup.length; j++) {
      let fg = idp.ForecastGroup[j];
      let fgsk = fg.$.SK;
      idpDetails.ForGrp.push({ idpSk: idpSk, fgsk: fgsk });
      for (let k = 0; k < fg.StaffGroup[0].StaffGroup.length; k++) {
        let sg = fg.StaffGroup[0].StaffGroup[k];
        let sgsk = sg.$.SK;
        idpDetails.StfGrp.push({ idpSk: idpSk, sgsk: sgsk });
      }
    }
  }
  console.log(
    `Importing ${idpDetails.ForGrp.length + idpDetails.StfGrp.length} idps.`
  );
  return idpDetails;
}

// Call web service to get the idp data of forecast group.
async function getIdpFgData(idpSk, fgsk) {
  let fgQuery = idpDetailsForGrp
    .replace('@idpSk', idpSk)
    .replace('@fgsk', fgsk);
  try {
    let idpFgData = await CallEWFMWebService('IDP', fgQuery);
    return idpFgData;
  } catch (err) {
    throw err;
  }
}

// Outputs web service idp data into readable string.
function idpFgToString(idp, idpSk) {
  let fg = idp.IDP.ForecastGroup[0];
  let resultArray = [];
  let fgsk = fg.$.SK;
  let openHours = fg.OpenHours[0].Period;
  for (let i = 0; i < fg.Element.length; i++) {
    let element = fg.Element[i];
    let elementName = element.$.ID;
    for (let j = 0; j < element.Value.length; j++) {
      if (openHours[j].$.Open === 'true') {
        let result = '';
        result += '(';
        result += idpSk + ',';
        result += fgsk + ',';
        result += openHours[parseInt(element.Value[j].$.Index)].$.Index + ',';
        result +=
          "'" + openHours[parseInt(element.Value[j].$.Index)].$.Open + "',";
        result +=
          "Cast('" +
          new Date(
            openHours[parseInt(element.Value[j].$.Index)]._
          ).toLocaleString() +
          "' as datetime2(0)),";
        result += `'${elementName}',`;
        result += element.Value[j]._;
        result += ')';
        resultArray.push(result);
      }
    }
  }
  return resultArray.join();
}

// Calls web service to get idp data for a staff group.
async function getIdpSgData(idpSk, sgsk) {
  let sgQuery = idpDetailsStfGrp
    .replace('@idpSk', idpSk)
    .replace('@sgsk', sgsk);
  try {
    let idpSgData = await CallEWFMWebService('IDP', sgQuery);
    return idpSgData;
  } catch (err) {
    throw err;
  }
}

// changes the idp web service data into a readable string output.
function idpSgToString(idp, idpSk) {
  // let result = '';
  let sg = idp.IDP.StaffGroup[0];
  let resultArray = [];
  let sgsk = sg.$.SK;
  let openHours = sg.OpenHours[0].Period;
  for (let i = 0; i < sg.Element.length; i++) {
    let element = sg.Element[i];
    let elementName = element.$.ID;
    for (let j = 0; j < element.Value.length; j++) {
      if (openHours[j].$.Open === 'true') {
        let result = '';
        result += '(';
        result += idpSk + ',';
        result += sgsk + ',';
        result += openHours[parseInt(element.Value[j].$.Index)].$.Index + ',';
        result +=
          "'" + openHours[parseInt(element.Value[j].$.Index)].$.Open + "',";
        result +=
          "Cast('" +
          new Date(
            openHours[parseInt(element.Value[j].$.Index)]._
          ).toLocaleString() +
          "' as datetime2(0)),";
        result += `'${elementName}',`;
        result += element.Value[j]._;
        result += ')';
        resultArray.push(result);
      }
    }
  }
  return resultArray.join();
}

// Import forcast group data. Validate and import.
async function importFgData(pool, idpFgData) {
  if (idpFgData.length == 0) {
    return;
  }
  try {
    await insertFgData(pool, idpFgData);
  } catch (err) {
    console.log('Error importing Fg data');
    console.log(err.stack);
    console.log(idpFgData.length);
  }
}

// Forcast group insert. Delete old data, insert new data, and merge new data. Throws error if any one of those fail.
async function insertFgData(pool, data) {
  try {
    const sqlInsert =
      'Insert into stg.IdpFgJs (IDP_SK,FOR_GRP_SK,[Index],[Open],[Interval],[ID],[Value]) Values @values';
    const myInsert = sqlInsert.replace('@values', data);
    await pool.request().query('Delete From stg.IdpFgJs');
    let insertResult = await pool.request().query(myInsert);
    if (insertResult.rowsAffected.length > 0) {
      if (insertResult.rowsAffected[0] > 0) {
        await pool.request().query('exec stg.spMergeIdpFgJs');
      }
    }
  } catch (err) {
    throw err;
  }
}

// Validate staff group input and then import the data.
async function importSgData(pool, idpFgData) {
  if (idpFgData.length == 0) {
    return;
  }

  // const pool = await new sql.ConnectionPool(sqlConfig);
  try {
    await insertSgData(pool, idpFgData);
  } catch (err) {
    console.log('Error importing Sg data');
    console.log(err.stack);
    console.log(idpFgData.length);
  }
}

// Staff group data insert. Delete old data, insert into staging table, then merge.
async function insertSgData(pool, data) {
  try {
    const sqlInsert =
      'Insert into stg.IdpSgJs (IDP_SK,STF_GRP_SK,[Index],[Open],[Interval],[ID],[Value]) Values @values';
    const myInsert = sqlInsert.replace('@values', data);
    await pool.request().query('Delete From stg.IdpSgJs');
    let insertResult = await pool.request().query(myInsert);
    if (insertResult.rowsAffected.length > 0) {
      if (insertResult.rowsAffected[0] > 0) {
        await pool.request().query('exec stg.spMergeIdpSgJs');
      }
    }
  } catch (err) {
    throw err;
  }
}

// Takes routing set sk (rssk), routing set code (rsCode), and the number of day previous to today and the the days after today to import idp data
async function main(rssk, rsCode, prevDays = 0, nextDays = 0) {
  const startDate = addDays(prevDays);
  const stopDate = addDays(nextDays);
  const pool = new sql.ConnectionPool(sqlConfig);
  try {
    await pool.connect();
    console.log('Connected to WfmData');
  } catch (err) {
    console.log('Could not connect to WfmData');
    console.log(err.stack);
    return;
  }
  console.log(
    `importing idps for ${rsCode} from between ${startDate.toLocaleString()} and ${stopDate.toLocaleString()}`
  );
  try {
    let idpList = await getIdpList(rssk, prevDays, nextDays);
    let idpDetails = getIdpListData(idpList);
    for (let i = 0; i < idpDetails.ForGrp.length; i++) {
      let idpFgData = await getIdpFgData(
        idpDetails.ForGrp[i].idpSk,
        idpDetails.ForGrp[i].fgsk
      );
      await importFgData(
        pool,
        idpFgToString(idpFgData, idpDetails.ForGrp[i].idpSk)
      );
    }
    for (let i = 0; i < idpDetails.StfGrp.length; i++) {
      let idpSgData = await getIdpSgData(
        idpDetails.StfGrp[i].idpSk,
        idpDetails.StfGrp[i].sgsk
      );
      await importSgData(
        pool,
        idpSgToString(idpSgData, idpDetails.StfGrp[i].idpSk)
      );
    }
  } catch (er) {
    console.log('An error occurred: ' + er);
    console.log(er.stack);
  } finally {
    await pool.close();
    console.log('Closed connection to WfmData');
  }
}

module.exports = main;
