// string manipulation to be asearchable with params, [from initial hashed to params compatible]
const bcrypt = require('bcrypt')

function hasherHash( pass ) {
    console.log(`${pass}`)
    let search = '/'
    let search2 = '[.]'
    let replacer = new RegExp( search, 'g' )
    let replacer2 = new RegExp( search2, 'g' )
    let passwordHash = bcrypt.hashSync( pass, 10 )
   // console.log(passwordHash)
    let pH1 = passwordHash.replace( replacer, '-' )
   // console.log(pH1)
    let finalHash = pH1.replace( replacer2, '_' )
    console.log( finalHash )
    return finalHash
}

module.exports = hasherHash