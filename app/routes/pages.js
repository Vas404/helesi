    var router = require('express').Router()
    const passport = require('passport')
    const app = require('../../server')
    require('../config/passport')(passport)
    const dec = require('../lib/decoder')


    
    router.get('/', function( req, res ){
       // console.log('congrats anoije h selida   ...')
        res.render( 'pages/index' )
    })


    router.get( '/usersMenu', (req, res, next)=>{
    
        console.log(req.headers)
        const decoded = dec.decode(req.headers["authorization"])
        const role = decoded['role']
        console.log(` this is the role passed in usersMenu: ${role}`)
        if( role ){
            console.log(`yparxei to role apo to jwt`)
            if(role === 'user'){
            res.render('pages/usersMenu')
            }
            else if(role === 'admin'){
                res.render('pages/adminMenu')
            }
            else if(role === 'superadmin'){
                res.render('pages/superadminMenu')
            }
        }else{
            console.log('You are not authorized to perform this action.')
            res.sendFile('unauthorized.html', { root: __dirname})
        }
 
    })


router.get('/adminMenu', (req,res,next)=>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']
    console.log(` this is the role passed in createUser: ${role}`)
    if( role === 'admin'){
        console.log(`yparxei to role apo to jwt`)
        
        res.render('pages/adminMenu')

    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }

})




router.get('/createUser',(req,res,next)=>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']
    console.log(` this is the role passed in createUser: ${role}`)
    if( role ){
        console.log(`yparxei to role apo to jwt`)
        
        res.render('pages/createUser')

    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }

})

router.get('/findUsers',(req,res,next)=>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']
    console.log(` this is the role passed in usersMenu: ${role}`)
    if( role ){
        console.log(`yparxei to role apo to jwt`)
        
        res.render('pages/findUsers')

    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }

})


router.get('/routes',(req,res,next)=>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']
    console.log(` this is the role passed in usersMenu: ${role}`)
    if( role ){
        console.log(`yparxei to role apo to jwt`)
        
        res.render('pages/routes')

    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }

})


router.get('/waste', (req, res, next)=>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']
    console.log(` this is the role passed in usersMenu: ${role}`)
    if( role ){
        console.log(`yparxei to role apo to jwt`)
        
        res.render('pages/waste')

    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }


 
    })
    router.use('/addwastes', (req, res, next)=>{
        console.log(req.headers)
        const decoded = dec.decode(req.headers["authorization"])
        const role = decoded['role']
        console.log(` this is the role passed in usersMenu: ${role}`)
        if( role ){
            console.log(`yparxei to role apo to jwt`)
            
            res.render('pages/addwastes')

        }else{
            console.log('You are not authorized to perform this action.')
            res.sendFile('unauthorized.html', { root: __dirname})
        }
 
    })
    





module.exports = router




