var config = {
  WfmServer: {
    user: 's_sfuser',
    password: 'spotfire',
    server: 'SQLINFWWDVP01\\DCPRD01',
    database: 'WfmData'
  },
  eWfmServer: {
    user: 'workforceuser',
    password: 'Frontier1',
    server: 'SQLINFWWDVP59\\DCPRD59',
    database: 'WFM'
  },
  avayaEch: {
    driver: 'msnodesqlv8',
    connectionString:
      'Driver={SQL Server Native Client 11.0};Server={SQLINFWWDVP03\\DCPRD03};Database={Avaya_ECH};Uid={s_workforceuser};Pwd={Frontier1};Trusted_Connection={yes};'
  }
};

module.exports = config;
