const db = require('../models')
const User = db.users
const bcrypt = require('bcrypt')
const hasherHash = require('../helpers/hasher')
const hasherSync = require('../helpers/hasherSync')
const { users } = require('../models')
const { send } = require('express/lib/response')
const utils = require('../lib/utils')
const dec = require('../lib/decoder')


//<----- create User ----->
//creates the user object taking a jwt from the admin currently logged in

exports.createUser = async( req, res, next ) =>{
    console.log(req.body)
    console.log(req.headers)
    const pass = req.body.password
    const decoded = dec.decode(req.headers["authorization"])
     
    
    const adminId = decoded['username']
    console.log('This is the adminId:  '+adminId)
    let password = hasherHash(pass)

    const user = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: password,
        role: 'user',
        createdById: adminId
    }

    User.create(user).then(data =>{

        const tokenObject = utils.issueJWT(user, adminId)           
        res.status(200).json({success: true, user: user, token: tokenObject.token, expiresIn : tokenObject.expires}) 
       
    }).catch(err =>{
        res.status(500).send({
            messsage:
            err.message || 'Some error occured while creating the User'
        })
    })

}
//<----- eof create user ----->

//<----- login ----->
//universal login function for both admins and users
exports.loginUser = async (req,res) => {
    console.log(req.body)
    const uname = req.body.username
    console.log("this is the username"+ uname)
    const pass = req.body.password
    const account = await User.findOne({where: { username: uname }})
    if( account){
        console.log(`this is the value for password passed to bcrypt: ${pass}`)
    const verified = bcrypt.compareSync(pass, hasherSync(account.password))
    console.log(`${account.password}`)
    console.log(`${verified}`)
     if(verified){
        const adminId = account.createdById
        console.log(`Welcome ${account.username}`)
        const jwt = utils.issueJWT(account, adminId)
        console.log(jwt.token)
        console.log(account)
        const opts = ({ success: true, user: account, token: jwt.token, expiresIn: jwt.expires })
        res.status(200).json(opts)
        
     }else
    console.log(`Incorrect password.`)
    }else
    console.log(`User ${uname}, was not found.`)
}
//<----- eof login ----->
//<--- start of updateUser
//in case we need to update the user, edit
exports.updateUser =  ( req, res ) =>{
    const id = req.params.id
    User.findOne({ where: { id:  id, role: 'user'} })
    .then(record => {
  
    if (!record) {
        throw new Error('No record found')
    }

    console.log(`retrieved record ${JSON.stringify(record,null,2)}`) 

    let values = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname:req.body.surname,
        password: hasherHash(req.body.password)
    }
  
    record.update(values).then( updatedRecord => {
        console.log('edw vgazei to undefined.')
        console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
        
    })

    })
    .catch((error) => {
    // do seomething with the error
    console.log(error)
    return("Something went wrong")
    })
    
}
//<---eof updateUser --->
//<--- start of updateAdmin --->
exports.updateAdmin =  ( req, res ) =>{
    const id = req.params.id
    User.findOne({ where: { id:  id, role: 'admin'} })
    .then(record => {
  
    if (!record) {
        throw new Error('No record found')
        
    }

    console.log(`retrieved record ${JSON.stringify(record,null,2)}`) 
    console.log(req.body)
    console.log(typeof(req.body))
    console.log(`Edw exw thema ${req.body.username}`)
    // let body2 = JSON.parse(req.body)
    let values = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname:req.body.surname,
        //password: hasherHash(req.body.password)
    }
  console.log(`edw vgazei undefined ${values}`)
    record.update(values).then( updatedRecord => {
        console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
        
    })

    })
    .catch((error) => {
    // do seomething with the error
    return (error)
        
    })
    
}
//<--- eof updateAdmin ---->

//<--- start of deleteUser ---->
exports.deleteUser =  ( req, res ) =>{
    const id = req.body.id
    User.findOne({ where: { id:  id}} )
    .then(record => {
  
    if (!record) {
        throw new Error('No record found')
        
    }
    else{
        User.destroy({
            where: {id: id}
        }).then(res.json({success: true}))
    }

    console.log(`retrieved record ${JSON.stringify(record,null,2)}`) 
    console.log(req.body)
    console.log(typeof(req.body))
    console.log(`${req.body.username}`)
   

    })
    .catch((error) => {
    // do seomething with the error
    return (error)
        
    })
}
    
//<--- eof deleteUser ---->


//<----- make admin ----->


        //need to hide for deploy  testing purposes we are the only superAdmin
exports.promoteToSuperAdmin =  ( req, res ) =>{
    const id = req.params.id
    User.findOne({ where: { id:  id} })
    .then(record => {
  
    if (!record) {
        throw new Error('No record found')
    }

    console.log(`retrieved record ${JSON.stringify(record,null,2)}`) 

    let values = {
        role : 'superadmin',
        createdById: 'Aratos'
    }
  
    record.update(values).then( updatedRecord => {
        console.log(`updated record ${JSON.stringify(updatedRecord,null,2)}`)
        
    })

    })
    .catch((error) => {
    // do seomething with the error
    throw new Error(error)
    })
    
}

//<----- eof make admin ----->

//<----- show all users both admins and superadmin and users ----->

exports.showAll = async ( req, res ) =>{
    const users = await User.findAll()
    console.log(users.every( user => user instanceof User )) // true
    console.log("All users:", JSON.stringify( users, null, 2 ))
    res.send(JSON.stringify( users, null, 2 ))
} 

//<----- eof show all users ----->

//<----- show all employees depending on the adminId----->

exports.showAllEmployees = async ( req, res ) =>{
    const decoded = dec.decode(req.headers["authorization"])
    const adminId = decoded['username']
    const users = await User.findAll({where:{  role: 'user' , createdById: adminId}})
    console.log(users.every( user => user instanceof User )) // true
    console.log("All users:", JSON.stringify( users, null, 2 ))
    res.send(JSON.stringify( users, null, 2 ))
} 

//<----- eof show all employees ----->
//<----- start of viewAdmins ----->
exports.viewAdmins = async ( req, res ) =>{
    const users = await User.findAll({where:{  role: 'admin'}})

    console.log(users.every( user => user instanceof User )) // true

    console.log("All users:", JSON.stringify( users, null, 2 ))

    res.send(JSON.stringify( {users: users}))

} 
//<--- eof viewAdmins --->

//<----- create Admin ----->

exports.createAdmin = async( req, res, next ) =>{
    console.log(req.body)
    const pass = req.body.password
    
    let password = hasherHash(pass)

    const user = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: password,
        role: 'admin'
    }

    User.create(user).then(data =>{

        const tokenObject = utils.issueJWT(user,'Aratos')           
        res.status(200).json({success: true, user: user, token: tokenObject.token, expiresIn : tokenObject.expires}) 
       
    }).catch(err =>{
        res.status(500).send({
            messsage:
            err.message || 'Some error occured while creating the Admin'
        })
    })

}
//<----- eof create admin ----->


//<---testing functions dev--->
exports.testtest = async(req, res, next)=>{
    console.log('Hello there it works fine')
    res.send('Hello there')
}

//testing purposes, no need for jwt to use
exports.testCreateAdmin = async( req, res, next ) =>{
 
    
    console.log( 'this is the body'+req.body)
    console.log('these are the headers:  ' + req.headers)
    const pass = req.body.password
    
     
    

    let password = hasherHash(pass)

    const user = {
        username: req.body.username,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        password: password,
        role: 'admin',
        createdById: 'Aratos'
    }

    User.create(user).then(data =>{

        const tokenObject = utils.issueJWT(user,'Aratos')           
        res.status(200).json({success: true, user: user, username: user.username , token: tokenObject.token, expiresIn : tokenObject.expires}) 
       
    }).catch(err =>{
        res.status(500).send({
            messsage:
            err.message || 'Some error occured while creating the Admin'
        })
    })

}