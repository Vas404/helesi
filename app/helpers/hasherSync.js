//string manipulation to be usable from params [from params to initial hashed]
function hasherSync( pass ) {
    console.log( `${pass}` )
    let search = '-'
    let search2 = '_'
    let replacer = new RegExp( search, 'g' )
    let replacer2 = new RegExp( search2, 'g' )
    
   // console.log(passwordHash)
    let pH1= pass.replace( replacer, '/' )
   // console.log(pH1)
    let finalHash = pH1.replace( replacer2, '.' )
    console.log( finalHash )
    return finalHash
}

module.exports = hasherSync