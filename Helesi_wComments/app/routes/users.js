var router = require('express').Router()
const passport = require('passport')
require('../config/passport')(passport)
const dec = require('../lib/decoder')
const routes_report = require('../controllers/routes_report.controller')
const route = require('../controllers/routes.controller')
const waste = require('../controllers/waste.controller')
const report = require('../controllers/report')
const update= require("../controllers/update.controller.js");

const {
    createUser,
    loginUser,
    showAll,
    promoteToSuperAdmin,
    createAdmin,
    showAllEmployees,
    testtest,
    testCreateAdmin,
    viewAdmins,
    updateUser,
    updateAdmin,
    deleteUser
    
} = require('../controllers/users')
const {
    createWaste
} = require('../controllers/wastes')

const {
    createRoute
} = require('../controllers/routes')


const { users } = require('../models/users')
const { wastes } = require('../models/wastes')
const { header } = require('express/lib/response')


// router.post('/signup',passport.authenticate('jwt', { session: false }), createUser )
router.use('/signup', ( req, res, next) =>{
    console.log(req.headers)
    
    const decoded = dec.decode(req.headers["authorization"])
    const adminId = decoded['adminId']
    const role = decoded['role'] 

    if(role === 'admin'){
         
        console.log( role )
        console.log( adminId )
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), createUser)



// router.route('/signup').post( createUser )
router.use('/createAdmin', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'superadmin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), createAdmin)


router.use('/createWaste', (req, res, next)=>{
    console.log( req.headers )
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']

    if(role === 'user'){
        console.log(role)
        next()
    }else{
        console.log('You are not authorized to perform this action. ')
        res.sendFile('unauthorized.html', { root: __dirname})
    }


}, passport.authenticate('jwt', {session: false}), createWaste )


router.use('/createRoute', (req, res, next)=>{
    console.log( req.headers )
    const decoded = dec.decode(req.headers["authorization"])
    const role = decoded['role']

    if(role === 'user'){
        console.log(role)
        next()
    }else{
        console.log('You are not authorized to perform this action. ')
        res.sendFile('unauthorized.html', { root: __dirname})
    }


}, passport.authenticate('jwt', {session: false}), createRoute )


router.use('/deleteuser', ( req, res, next) =>{
    console.log(req.headers)
    
    const decoded = dec.decode(req.headers["authorization"])
    const adminId = decoded['adminId']
    const role = decoded['role'] 

    if(role === 'admin'){
         
        console.log( role )
        console.log( adminId )
        next()
       
    }
    else if(role === 'superadmin'){
        console.log( role )
        
        next()
    }
        else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), deleteUser)










//router.route('/signup',passport.authenticate('jwt',{session: false })).post( createUser )
router.route('/login').post( loginUser )
router.use('/users', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'superadmin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), showAll )

router.use('/employees', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'admin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), showAllEmployees )


router.use('/updateUser/:id', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'admin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), updateUser )



router.use('/updateAdmin/:id', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'superadmin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), updateAdmin )





router.use('/viewAdmins', ( req, res, next) =>{
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])

    const role = decoded['role'] 
    if(role === 'superadmin'){
         
        console.log(role)
        next()
       
    }else{
        console.log('You are not authorized to perform this action.')
        res.sendFile('unauthorized.html', { root: __dirname})
    }
},passport.authenticate('jwt',{session: false}), viewAdmins )


router.use('/testCreateAdmin', testCreateAdmin )
router.route('/promoteToSuperAdmin/:id').get( promoteToSuperAdmin )
router.route('/test').get( testtest )


router.use('/routesreport',report.routesReport)
router.use('/wastereport', report.wasteReport)

router.use('/printsinglewaste',report.PrintSingleWaste)
router.use('/setsinglewaste/:id', report.SetPrintFileSingleWaste)
router.post("/updatedb",update.Update);
/////create waste////
router.post("/create",waste.create);
/////create router///
router.post("/create_route",route.create);

// route report
router.post("/routesreport",routes_report.routesReport);
//print report
router.post("/printroutes", report.PrintRoutes);
router.get("/setprintroutes/:params",report.SetPrintFileRoutes);

//print single entry
router.post("/printsingleroutes", report.PrintSingleRoute)
router.get("/setsingleroute/:id",report.SetPrintFileSingleRoute)
router.get("/check_routes/:id", routes_report.check_routes);

//print report
router.post("/printwaste", report.PrintWaste);
//router.get("/setprintwaste/:id",report.SetPrintFileWaste);
router.get("/setprintwaste/:params",report.SetPrintFileWaste)


//router.route('/testAdmin').post( testCreateAdmin )





module.exports = router