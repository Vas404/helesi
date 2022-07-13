//Passport configuration with jwt strategy, whilst using keys
//the jwt holds information for when it was issued when it expires and in the payload 
//we have information about the user object found in the database.
const fs = require('fs') 
const { userInfo } = require('os')
const path = require('path')
const db = require('../models')
const User = db.users

const Op = db.Sequelize.Op


const JwtStrategy = require( 'passport-jwt' ).Strategy
const ExtractJwt = require( 'passport-jwt' ).ExtractJwt
//verification step with passport.js
const pathToKey = path.join( __dirname, '..', 'id_rsa_pub.pem' )
const PUB_KEY = fs.readFileSync( pathToKey, 'utf8' )



const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256']
}

const strategy = new JwtStrategy( options, async (payload, done) => {
    const id = payload.username
    
   const results = await User.findOne( {where: { username: id  } } )
    .then( ( user ) => {
        if(user){
           console.log('This is the user found inside JWTStrategy//passport.: '+ `${JSON.stringify(user)}`)
           
            return done( null, user, { msg:['All ok'] })
        }else{
            return done( null, false )
        }
    })
    .catch( err => done( err, null ) )

})


//TODO

module.exports = ( passport ) => {
    passport.use( strategy )
  
}
