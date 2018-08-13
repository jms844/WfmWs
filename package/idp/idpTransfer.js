var exec = require('child_process');
var parseString = require('xml2js');
var fs = require('fs');
var sql = require('mssql');

const wfmDataConnection = require('../db/WfmData');
const sql = require('mssql');

var readFilePath = './package/idp/jscript/templates/IdpFg.xml';
var readFilePathSg = './package/idp/jscript/templates/IdpSg.xml';
var writeFilePath = './package/idp/jscript/xml/idpIn.xml';
var writeFilePathSg = './package/idp/jscript/xml/idpInSg.xml';
var idpCommand = 'cscript ./package/idp/jscript/eWfmWsTest.js';
var idpCommandSg = 'cscript ./package/idp/jscript/eWfmWsTestSg.js';

var mergeString = 'Merge into dbo.IdpFg dst\n' +
    'Using(\n' +
    '\tValues @idpValues\n' +
    ') src (IDP_SK,FOR_GRP_SK,[Index],[Open],Interval,ID,[Value])\n' +
    '\ton dst.IDP_SK = src.IDP_SK\n' +
    '\tand dst.FOR_GRP_SK = src.FOR_GRP_SK\n' +
    '\tand dst.Interval = src.Interval\n' +
    '\tand dst.ID = src.ID\n' +
    'When matched then Update\n' +
    '\tSet dst.[Value] = src.[Value]\n' +
    'When not matched then\n' +
    '\tInsert(IDP_SK,FOR_GRP_SK,[Index],[Open],Interval,ID,[Value])\n' +
    '\tValues(src.IDP_SK,src.FOR_GRP_SK,src.[Index],src.[Open],src.Interval,src.ID,src.[Value]);';

var mergeStringSg = 'Merge into dbo.IdpSg dst\n' +
    'Using(\n' +
    '\tValues @idpValues\n' +
    ') src (IDP_SK,STF_GRP_SK,[Index],[Open],Interval,ID,[Value])\n' +
    '\ton dst.IDP_SK = src.IDP_SK\n' +
    '\tand dst.STF_GRP_SK = src.STF_GRP_SK\n' +
    '\tand dst.Interval = src.Interval\n' +
    '\tand dst.ID = src.ID\n' +
    'When matched then Update\n' +
    '\tSet dst.[Value] = src.[Value]\n' +
    'When not matched then\n' +
    '\tInsert(IDP_SK,STF_GRP_SK,[Index],[Open],Interval,ID,[Value])\n' +
    '\tValues(src.IDP_SK,src.STF_GRP_SK,src.[Index],src.[Open],src.Interval,src.ID,src.[Value]);';

var idpFgXml = '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">\n' + 
    '\t<IDP SK="-969564777970"/>\n' + 
    '\t<ForecastGroup SK="@fgsk">\n' + 
    '\t\t<Element ID="RVSFORVOL"/>\n' + 
    '\t\t<Element ID="RVSFORAHT"/>\n' + 
    '\t\t<Element ID="ORGFORVOL"/>\n' + 
    '\t\t<Element ID="ORGFORAHT"/>\n' + 
    '\t</ForecastGroup>\n' + 
    '</IDPDetails>'

const idpSgXml = '<IDPDetails IncludeProperties="true" IncludeOpenHours="true">\n' + 
        '\t<IDP SK="@idpSk"/>\n' + 
        '\t<StaffGroup SK="@sgsk">\n' + 
            '\t<Element ID="RVSREQSTF"/>\n' + 
            '\t<Element ID="STFRVSREQSTFWUNP"/>\n' + 
            '\t<Element ID="STFRVSSCHSTFWADJ"/>\n' + 
            '\t<Element ID="STFRVSSCHSTFWOADJ"/>\n' + 
        '\t</StaffGroup>\n' + 
    '</IDPDetails>'
function getFgIdpData(idpsk, fgsk, callback){
    exec(idpCommand,function(err, stdout, stderr){
        if(err) throw err;
        console.log(stdout);
    })
}