/*   Set m_WFMHost, m_WFMDatabaseAlias, m_Username, and m_Password    according to your local configuration. 
 
  Your installation of the WFM web services MUST (!) be set to use BASIC authentication rather than FORM authentication. 
 
*/
var m_WFMHost = "ewfmweb.corp.pvt";
var m_WFMDatabaseAlias = "WFMData";
var m_Username = "s_workforceuser";
var m_Password = "Frontier1";
var m_TimeoutValue = 480; // 8 minutes

function PostURL(ServletName) {
  var result;
  result =
    "http://" +
    m_WFMHost +
    "/WFMWebSvcs/" +
    m_WFMDatabaseAlias +
    "/ENU/API/servlet/" +
    ServletName +
    ".ewfm";
  return result;
}

function PostBody(DataIn) {
  var result;
  result =
    "NoStyle=&NoErrorStyle=&" +
    "data_in=" +
    escape(DataIn) +
    "&Timeout=" +
    m_TimeoutValue;
  return result;
}

function CallEWFMWebService(HttpReq, ServletName, DataIn) {
  var HTTPREQUEST_SETCREDENTIALS_FOR_SERVER = 0;
  HttpReq.SetTimeouts(0, 0, 0, 0); // using POST method   var url = PostURL(ServletName);   var body = PostBody(DataIn);   HttpReq.Open('POST', url);
  HttpReq.SetRequestHeader("Content-Type", "application/x-www-formurlencoded");
  HttpReq.SetCredentials(
    m_Username,
    m_Password,
    HTTPREQUEST_SETCREDENTIALS_FOR_SERVER
  );
  HttpReq.Send(body);
  return HttpReq.ResponseText;
}

console.log("Got here");
try {
  var HttpReq = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
  var x;

  console.log("Calling AdminGetUserProfile");
  x = CallEWFMWebService(HttpReq, "AdminGetUserProfile", "");
  console.log(x);

  /*   x = CallEWFMWebService(HttpReq, 'AdminAgentDataGroupLookup', '<AgentDataGroupLookup><PartialCode>A</PartialCode></AgentDataGroupLoo kup>');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'AdminContactDataGroupLookup', '<ContactDataGroupLookup><PartialCode>A</PartialCode></ContactDataGrou pLookup>');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'EmployeeInfo', '<EmployeeInfo><Employee SK="-989928946686"></Employee><Employee SK="989999973533"></Employee><IncludeExtraFields></IncludeExtraFields></Em ployeeInfo>');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'AdminGetUserProfile', '');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'AdminEcho', '<Testing/>');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'AdminVersionInformation', '');   console.log(x); 
   
    x = CallEWFMWebService(HttpReq, 'AdminSysInfo', '');   console.log(x);
     x = CallEWFMWebService(HttpReq, 'AdminSystemParameters', '<SystemParameters><SystemParameter Name="ForecastUnit"/></SystemParameters>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'AdminSecurityLocks', '<SecurityLocks><SystemLock><Lock>149</Lock></SystemLock><SystemLock>< Lock>150</Lock></SystemLock></SecurityLocks>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'AdminTimeConversion', '<TimeConversion><TimeZone SK="-989999999596"/><DateTime>2001-1002T07:00:00</DateTime></TimeConversion>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'AdminDatabaseAliases', ''));   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'EmployeeLookup', '<EmployeeSelector><Employee SK="992147439297"/></EmployeeSelector>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'EmployeeGroups', '<EmployeeGroupLookup><PartialCode>CSV</PartialCode></EmployeeGroupLoo kup>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'AccountPersonalAccountLookup', '<PersonalAccountLookup><PartialCode>V</PartialCode></PersonalAccountL ookup>');   console.log(x); 
 
  x = CallEWFMWebService(HttpReq, 'EmployeeLookup', '<EmployeeSelector><Name>Zu</Name></EmployeeSelector>');   console.log(x); 
 
*/
} catch (er) {
  console.log("An error occurred: " + er);
}
