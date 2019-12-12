 const mysql = require('mysql')
// const pool  = mysql.createPool({
//   host            : '127.0.0.1',
//   user            : 'root',
//   password        : 'Maitian123',
//   database        : 'fashion_store',
// })

const config = require('./config.json');
const pool  = mysql.createPool({
    host     : config.dbhost,
    user     : config.dbuser,
    password : config.dbpassword,
    database : config.dbname
  });


module.exports = pool