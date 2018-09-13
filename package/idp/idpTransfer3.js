/*   Set m_WFMHost, m_WFMDatabaseAlias, m_Username, and m_Password    according to your local configuration. 
 
  Your installation of the WFM web services MUST (!) be set to use BASIC authentication rather than FORM authentication. 
 
*/

const axios = require('axios');
const parseString = require('xml2js-parser').parseStringSync;
const sql = require('mssql');
const sqlConfig = require('../../config/db').WfmServer;

axios.defaults.headers.common['Content-type'] =
  'application/x-www-form-urlencoded';
axios.defaults.headers.common['Authorization'] =
  'Basic Y29ycFxzX3dvcmtmb3JjZXVzZXI6RnJvbnRpZXIx';

var m_WFMHost = 'ewfmweb.corp.pvt';
var m_WFMDatabaseAlias = 'WFMData';
var m_TimeoutValue = 480; // 8 minutes

const idpDetailsForGrp =
  '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">' +
  '	<IDP SK="@idpSk"/>' +
  '	<ForecastGroup SK="@fgsk">' +
  '		<Element ID="RVSFORVOL"/>' +
  '		<Element ID="ORGFORVOL"/>' +
  // '		<Element ID="ActualNco"/>' +
  '		<Element ID="RVSFORAHT"/>' +
  '		<Element ID="ORGFORAHT"/>' +
  // '		<Element ID="ActualAht"/>' +
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

const stfGrpLookup =
  '<StaffGroupLookup>' +
  '	<PartialCode>@sgPartialCode</PartialCode>' +
  '</StaffGroupLookup>';

const forGrpLookup =
  '<ForecastGroupLookup>' + '	<Code>@fgCode</Code>' + '</ForecastGroupLookup>';

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

async function CallEWFMWebService(ServletName, DataIn, callback) {
  var HTTPREQUEST_SETCREDENTIALS_FOR_SERVER = 0;
  //   HttpReq.SetTimeouts(0, 0, 0, 0); // using POST method
  var url = PostURL(ServletName);
  // console.log(url);
  var body = PostBody(DataIn);
  // console.log(body);
  try {
    let result = await axios.post(url, body);
    let parsedResult = await parseString(result.data);
    return parsedResult;
  } catch (err) {
    throw err;
  }
  //   return await parseString(await axios.post(url, body));
  //   axios
  //     .post(url, body)
  //     .then(result => {
  //       parseString(result.data, function(err, parsed) {
  //         // console.dir(parsed.IDPs.IDP[0].$.SK);
  //         callback(parsed);
  //       });
  //     })
  //     .catch(err => {
  //       console.log('Error when calling web service');
  //       throw 'Error: ' + err;
  //     });
  // HttpReq.Open('POST', url);
  //   HttpReq.SetRequestHeader('Content-Type', 'application/x-www-formurlencoded');
  //   HttpReq.SetCredentials(
  //     m_Username,
  //     m_Password,
  //     HTTPREQUEST_SETCREDENTIALS_FOR_SERVER
  //   );
  //   HttpReq.Send(body);
  // return HttpReq.ResponseText;
}

function printResult(result) {
  console.log('Printing result');
  // console.log(result.IDP);
}
function printFg(result) {
  console.dir(result);
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

function addDays(days) {
  let today = new Date();
  let date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  date.setDate(date.getDate() + days);
  return date;
}

function getIdpListData(idpList) {
  let idps = idpList.IDPs.IDP;
  let idpDetails = {
    ForGrp: [],
    StfGrp: []
  };
  for (let i = 0; i < idps.length; i++) {
    let idp = idps[i];
    // console.log(idp.ForecastGroup[0].StaffGroup[0].StaffGroup);
    let idpSk = idp.$.SK;
    for (let j = 0; j < idp.ForecastGroup.length; j++) {
      // console.log('FGSK' + idp.ForecastGroup[j].$.SK);
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
  return idpDetails;
}

async function getIdpFgData(idpSk, fgsk) {
  let fgQuery = idpDetailsForGrp
    .replace('@idpSk', idpSk)
    .replace('@fgsk', fgsk);
  let idpFgData = await CallEWFMWebService('IDP', fgQuery, idpFgDataToString);
  return idpFgData;
}

function idpFgDataToString(idpData) {
  let result = '';
  let idp = idpData.IDP;
  let idpSk = idp.$.SK;
  for (let i = 0; i < idp.ForecastGroup.length; i++) {
    let fg = idp.ForecastGroup[i];
    result += idpFgToString(fg, idpSk);
    if (i < idp.ForecastGroup.length - 1) {
      result += ',';
    }
  }
  console.log(result);
  return result;
}

function idpFgToString(idp, idpSk) {
  // let result = '';
  let fg = idp.IDP.ForecastGroup[0];
  let resultArray = [];
  let fgsk = fg.$.SK;
  let openHours = fg.OpenHours[0].Period;
  // console.log(openHours);
  for (let i = 0; i < fg.Element.length; i++) {
    let element = fg.Element[i];
    let elementName = element.$.ID;
    // console.log(element.Value);
    // console.log('');
    for (let j = 0; j < element.Value.length; j++) {
      // let openStatus = openHours[j].$.Open === 'true';
      if (openHours[j].$.Open === 'true') {
        // console.log(openHours[j].$.Open);
        let result = '';
        result += '(';
        result += idpSk + ',';
        result += fgsk + ',';
        result += openHours[parseInt(element.Value[j].$.Index)].$.Index + ',';
        result += openHours[parseInt(element.Value[j].$.Index)].$.Open + ',';
        result += "'" + openHours[parseInt(element.Value[j].$.Index)]._ + "',";
        result += `'${elementName}',`;
        // console.log(element.Value[j]._);
        result += element.Value[j]._;
        result += ')';
        resultArray.push(result);
      }
    }
  }
  return resultArray.join();
}

async function getIdpSgData(idpSk, sgsk) {
  let sgQuery = idpDetailsStfGrp
    .replace('@idpSk', idpSk)
    .replace('@sgsk', sgsk);
  let idpSgData = await CallEWFMWebService('IDP', sgQuery);
  return idpSgData;
}

async function main(rssk, rsCode, prevDays = 0, nextDays = 0) {
  try {
    // var HttpReq = new ActiveXObject('WinHttp.WinHttpRequest.5.1');
    // var x;

    // console.log('Calling AdminGetUserProfile');
    // CallEWFMWebService('IDPStaffGroupLookup', stfGrpLookup, printResult);
    // CallEWFMWebService('IDPForecastGroupLookup', forGrpLookup, printFg);
    // console.log(prevDays);
    // console.log(nextDays);
    let idpList = await getIdpList(rssk, prevDays, nextDays);
    let idpDetails = getIdpListData(idpList);
    // console.log(idpDetails);
    for (let i = 0; i < idpDetails.ForGrp.length; i++) {
      let idpFgData = await getIdpFgData(
        idpDetails.ForGrp[i].idpSk,
        idpDetails.ForGrp[i].fgsk
      );
      console.log(idpFgToString(idpFgData, idpDetails.ForGrp[i].idpSk));
    }
    for (let i = 0; i < idpDetails.StfGrp.length; i++) {
      let idpSgData = await getIdpSgData(
        idpDetails.StfGrp[i].idpSk,
        idpDetails.StfGrp[i].sgsk
      );
      // console.log(idpSgData);
    }
    // console.log(x);

    /*   
	
	*/
  } catch (er) {
    console.log('An error occurred: ' + er);
  }
}

module.exports = main;
