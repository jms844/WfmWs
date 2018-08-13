var Client = require('../node_modules/ssh2/lib/client');

var hostKey = 'ssh-rsa 1024 7f:7c:2c:70:dc:76:60:b9:d5:52:19:d5:bb:9f:55:80'
 
var conn = new Client();

conn.connect({
  host: 'ftp.knowlagentondemand.com',
  port: 22,
  username: 'frontier',
  password: 'keMa&Am6',
  algorithms:{
    serverHostKey: ['ssh-rsa']
  },
  publicKey: hostKey
});

conn.on('ready', function() {
  console.log('Client :: ready');
  conn.sftp(function(err, sftp) {
    if (err) throw err;
    sftp.readdir('foo', function(err, list) {
      if (err) throw err;
      console.dir(list);
      conn.end();
    });
  });
});

module.exports = conn;