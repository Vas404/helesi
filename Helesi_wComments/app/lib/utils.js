//contains information about the jwt that is created [what it contains in the payload section and expiration]/*  */


const jsonwebtoken = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')


const pathToKey = path.join( __dirname, '..', 'id_rsa_priv.pem' )
const PRIV_KEY = fs.readFileSync( pathToKey, 'utf8' )




function issueJWT( user, adminId ) {

    const id = user.id
    const role = user.role
    const username = user.username
    const expiresIn = '2w'
     // to username to admin pou dhmiourghse ton xrhsth

    const payload = {
        sub: id,
        username: username,
        adminId: adminId,
        role: role,
        iat: Date.now()
    }

    const signedToken = jsonwebtoken.sign( payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' } )

    return{
        token: "Bearer"+ ' ' + signedToken,
        expires: expiresIn
    }
}

module.exports.issueJWT = issueJWT