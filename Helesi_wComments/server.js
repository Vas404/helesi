//server->cors options, routes to implement running port models passport disconnect function
//credentials
const express = require('express')
const mysql = require('mysql')
var path = require('path')
const cors = require('cors')
const fs = require('fs')
const app = express()
app.use((req, res, next) => {
    if (!isSecure(req)) {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });
require('dotenv').config()
const errorHandler = require('./app/helpers/error-handler')
const users = require('./app/routes/users')
const pages = require('./app/routes/pages')
const errors = require('./app/routes/errors')
const ejsLint = require('ejs-lint')
const https = require('https')
const http = require('http')

const passport = require('passport')

require('./app/config/passport')(passport)

var port = null
var models = require('./app/models')
//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Nice! Database looks fine')
 
}).catch(function(err) {
 
    console.log(err, "Something went wrong with the Database Update!")
 
})


// var port = null

// if(  ){
//      port = 443
    
// }else{
//      port = 80
// }

const api = process.env.API_URL
var corsOptions = [`https://95.216.162.109:443`,
		`https://blockchain.helesi.tech`,
                  `http://95.216.162.109:443`,
       {  origin:  `https://95.216.162.109:443`}]



//middleware
app.use( cors( corsOptions ) )//Use origin of the server
app.use( express.json() )// parse requests of content-type - application/json
app.use( express.urlencoded( { extended: true } ) )// parse requests of content-type - application/x-www-form-urlencoded
app.use( errorHandler )
app.set( 'trust proxy', true )
app.use( express.static( 'app/public' ) )//Set the path to static sources (css,js files)




const db = require( './app/models' )
//const { dialect, DB, USER, PASSWORD } = require('./app/config/config')


require( './app/config/passport' )
app.use( passport.initialize() )

//set view engine to ejs
app.set('views', path.join(__dirname, `app/views`))
app.engine('ejs', require('ejs').renderFile)
app.set('view engine', 'ejs')


//routes
app.use( `${api}`, users, pages, errors ) 


//<!----- send Map data ---->
app.get(`${api}/map`, async ( req, res, next )=>{
    res.sendFile( path.resolve( './app/map/map.html' ) )
    next()
},(req, res, next)=>{
    var data = (require('./app/map/map_points'))
    
    res.send(JSON.stringify(data))
})

function isSecure(req) {
    if (req.headers['x-forwarded-proto']) {
      return req.headers['x-forwarded-proto'] === 'https';
    }
    return req.secure;
  };



const nodeFetch = require('node-fetch')
global.fetch = nodeFetch;


run().catch(error => console.error(error.stack));
async function run() {
}



var config = {
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port:3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
   // socketPath:`cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
}

if( process.env.NODE_ENV === 'production' ){
    config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`
}

var connection = mysql.createConnection( config )

connection.connect( function( err ) {
    console.log( config )
	if( err ) {
        console.log( config )
		console.log( 'Connection is asleep (time to wake it up): ', err );
		setTimeout( handleDisconnect, 1000 )
		handleDisconnect()
	}
	})


// app.listen(443 || 80, () => {
//     console.log('Server is started on 127.0.0.1:'+ (443 || 80))
//     console.log('Environment set to '+ process.argv[3])
// })


const privateKey = fs.readFileSync('/etc/letsencrypt/live/blockchain.helesi.tech/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/blockchain.helesi.tech/cert.pem', 'utf8');   
const ca = fs.readFileSync('/etc/letsencrypt/live/blockchain.helesi.tech/fullchain.pem', 'utf8');   
const credentials = {   key: privateKey,   cert: certificate,   ca: ca   };       




https.createServer( credentials,app).listen(443, () => {   
    port = 443
    console.log('HTTPS Server running on port 443')
   })

http.createServer(function (req, res) {   
    // port = 80
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url })  
    res.end()  
    })
    //.listen(80)











function handleDisconnect() {
	console.log( 'handleDisconnect()' )
	connection.destroy( )
	connection = mysql.createConnection( config );
	connection.connect( function( err ) {
	    if( err ) {
			console.log( ' Error when connecting to db  (DBERR001):', err );
			setTimeout( handleDisconnect, 1000 )
	    }
	})

}
app.listen( port,() => {
    console.log( `Server is listening on port: ${port}` )

})

module.exports = app