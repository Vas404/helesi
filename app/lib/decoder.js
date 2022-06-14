const jwt_decode = require('jwt-decode')
require('express')

function decode( auth, res, next ){
    var authHeader =   auth
    console.log(authHeader)
    if (typeof authHeader !== 'string') {
        
       console.log('str is not a string');
        return ('Error Unauthorized')
      } else {
       
     
   
    const token = authHeader.split(' ')[1]
    console.log(token)
    var decoded = jwt_decode( token )
    //console.log(decoded)
    console.log( 'this is the decoded.role: '+decoded.role )
    console.log( 'This is the decoded.adminId: '+decoded.adminId )
    return decoded
     }
}


module.exports.decode = decode