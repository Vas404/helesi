// initiallizing the sequelize models
const dbConfig = require("../config/config")
const Sequelize = require('sequelize')
var fs = require('fs')
var path = require('path')


if(process.env.NODE_ENV === 'production'){
  var sequelize = new Sequelize( {
    socketPath: dbConfig.socketPath,
    dialect: dbConfig.dialect,
    dialectOptions: {
      socketPath: dbConfig.socketPath
    },
    host: dbConfig.socketPath
    })    
  }

else{
  var sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    

    pool: {

      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
      
    },
    
  }) 
} 


const db = {}

// sequelize.sync({ force : true }) reset rebuild database


db.sequelize = sequelize
db.Sequelize = Sequelize
db.users = require('./users')(sequelize, Sequelize)
db.wastes = require('./wastes')(sequelize, Sequelize)
db.routes = require('./routes')(sequelize, Sequelize)

module.exports = db