const axios = require('axios');
const parseString = require('xml2js').parseString;

axios.defaults.headers.common['Content-type'] =
  'application/x-www-form-urlencoded';
axios.defaults.headers.common['Authorization'] =
  'Basic Y29ycFxzX3dvcmtmb3JjZXVzZXI6RnJvbnRpZXIx';

const idpLookupReq =
  'NoStyle=&NoErrorStyle=&' +
  'data_in=' +
  '<IDPLookup><RoutingSet SK="-969782163054"/><DateTimeRange><Start>2018-09-05T00:00:00</Start><Stop>2018-09-06T00:00:00</Stop></DateTimeRange></IDPLookup>' +
  '&Timeout=480';

const idpRoutingSetLookupReq =
  'NoStyle=&NoErrorStyle=&' +
  'data_in=' +
  '<RoutingSetLookup><RoutingSet SK="-969782163054"/></RoutingSetLookup>' +
  '&Timeout=480';

const idpStfGrpLookupReq =
  'NoStyle=&NoErrorStyle=&' +
  'data_in=' +
  '<StaffGroupLookup IncludeAgentGroups="true"><StaffGroup SK="-969782179131"/></StaffGroupLookup>' +
  '&Timeout=480';

const idpDetailsLookupReq =
  'NoStyle=&NoErrorStyle=&' +
  'data_in=' +
  '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">' +
  '<IDP SK="-969514213005"/>' +
  //   '<ForecastGroup SK="-969782180303">' +
  //   '<Element ID="RVSFORVOL"/>' +
  //   '<Element ID="ORGFORVOL"/>' +
  //   '<Element ID="RVSFORAHT"/>' +
  //   '</ForecastGroup>' +
  //   '<StaffGroup SK="-969782179131">' +
  //   '<Element ID="STFRVSSCHSTFWOADJ"/>' +
  //   '<Element ID="STFRVSSCHSTFWADJ"/>' +
  //   '</StaffGroup>' +
  '</IDPDetails>' +
  '&Timeout=480';

axios
  .post(
    'http://ewfmweb.corp.pvt/WFMWebSvcs/WFMData/ENU/API/servlet/IDPLookup.ewfm',
    idpLookupReq
  )
  .then(result => {
    parseString(result.data, function(err, parsed) {
      //   console.dir(parsed.IDPs.IDP[0].$.SK);
    });
  })
  .catch(err => console.log(err));

axios
  .post(
    'http://ewfmweb.corp.pvt/WFMWebSvcs/WFMData/ENU/API/servlet/IDP.ewfm',
    idpDetailsLookupReq
  )
  .then(result => {
    parseString(result.data, function(err, parsed) {
      //   console.dir(parsed);
    });
  })
  .catch(err => console.log(err));

// axios
//   .post(
//     'http://ewfmweb.corp.pvt/WFMWebSvcs/WFMData/ENU/API/servlet/IDPRoutingSetLookup.ewfm',
//     idpRoutingSetLookupReq
//   )
//   .then(result => {
//     parseString(result.data, (err, parsed) => {
//       if (err) {
//         console.log(err);
//         return;
//       }
//       //   console.dir(
//       //     parsed.RoutingSetList.RoutingSet[0].StaffGroupProperty[0].StaffGroup
//       //   );
//     });
//   })
//   .catch(err => console.log(err));

axios
  .post(
    'http://ewfmweb.corp.pvt/WFMWebSvcs/WFMData/ENU/API/servlet/IDPStaffGroupLookup.ewfm',
    idpStfGrpLookupReq
  )
  .then(result => {
    parseString(result.data, (err, parsed) => {
      if (err) {
        console.log(err);
        return;
      }
      console.dir(parsed.StaffGroups.StaffGroup[0].Tree);
    });
  })
  .catch(err => console.log(err));

// var HttpClient = function() {
//   this.get = function(aUrl, aCallback) {
//     var xmlHttp = new XMLHttpRequest();
//     xmlHttp.onreadystatechange = function() {
//       if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
//         aCallback(xmlHttp.responseText);
//       }
//     };

//     xmlHttp.open('GET', aUrl, true);
//     xmlHttp.send(null);
//   };
// };

// var client = new HttpClient();
// client.get(
//   'http://ewfmweb.corp.pvt/WFMWebSvcs/WFMData/ENU/API/servlet/AdminGetUserProfile.ewfm',
//   function(response) {
//     console.log(response);
//   }
// );
