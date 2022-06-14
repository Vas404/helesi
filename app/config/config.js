//const mysql = require('mysql')
var configs = {
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASS,
    DB: process.env.DB_NAME,
    dialect: "mysql",
    dialectOptions: {
      charset: 'AL32UTF8',
      collate: 'utf8mb4_unicode_ci',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }

  if( process.env.NODE_ENV === 'production' ) {
    configs.user = process.env.CLOUD_USER
    console.log( 'Running from cloud. Connecting to DB through GCP socket.' )
    configs.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
    configs.dialect = process.env.DB_DIALECT
    
   
  }
  // When running from localhost, get the config from .env
  else {
  console.log( 'Running from localhost. Connecting to DB directly.' );
  configs.host = process.env.DB_HOST
}



module.exports = configs