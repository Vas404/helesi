const db = require('../models')
const Waste = db.wastes
const Route = db.routes
const bcrypt = require('bcrypt')
const hasherHash = require('../helpers/hasher')
const hasherSync = require('../helpers/hasherSync')
const { wastes } = require('../models')
const { send } = require('express/lib/response')
const utils = require('../lib/utils')
const { Op } = require('sequelize')
const res = require('express/lib/response')
var html_to_pdf = require('html-pdf-node')
var fs = require('fs')
require('../exportCSV')

//<------ create route log ----->

exports.createRoute = async ( req, res ,next ) => {
    console.log( req.body )
//const blockid = await wastes-Smart Contract, get blockId now not working

    const route = {
        date: req.body.date,
        
        driver: req.body.driver,
        location: req.body.location,
        kg: req.body.kg,
    
        vehicle: req.body.vehicle,
        coords: req.body.coords,
        weight: req.body.weight,
        time: req.body.time,
        routebinid: req.body.routebinid,
    }
    
    Route.create(route).then( data => {
    res.status(200).json({success: true, route: route})

    }).catch( err =>{
        res.status(500).send({
             message:
             err.message || 'Some error occured while creating the waste log. '
        })
       
    })

}
//<------- eof create route log ----->


//not used
exports.searchRoute = async ( req, res, next ) =>{

    console.log( req.body )
    const date1 = req.body.date1.getTime()
    const date2 = req.body.date2.getTime()
    const promiseInvoices = [{}]
    const rout = await Route.findAll( {where: { date: { [Op.between]: [date1, date2]  }}
    }).then( result => {
        async()=>{
        for await (const hash of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
            const log = await wastesSmartContract( hash ) 
            console.log( log )
            let w = {}
            
            w.date= rout.date,
            w.vehicle= rout.vehicle,
            w.coords= rout.coords,
            w.kg= rout.kg,
            w.time = rout.time,
            
            w.driver= log.driver,
            w.location= log.location,
            
            w.routebinid= log.routebinid
            
            console.log( w )
            promiseInvoices.push( w )
        }
            }
    })
    res.send( promiseInvoices )

}
   //not used
exports.searchRouteWeekly = async ( req, res, next ) =>{
    console.log( req.body )
    var date1 = new Date()
    var date2 = new Date(date1.getFullYear(), today.getMonth(), today.getDate()-7)
    
    const promiseInvoices = [{}]
    const rout = await Route.findAll({ where: { date: { [Op.between]: [date1, date2]  } }
    }).then( result => {
        async()=>{

        
        for await (const hash of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
            const log = await routeSmartContract(hash) 
            console.log(log)
           let w = {}
            
                w.date= rout.date,
                w.vehicle= rout.vehicle,
                w.coords= rout.coords,
                w.kg= rout.kg,
                w.time = rout.time,
                
                w.driver= log.driver,
                w.location= log.location,
                
                w.routebinid= log.routebinid
            
            console.log( w )
            promiseInvoices.push( w )
        }
        }
    })
    res.send( promiseInvoices )
    

}
//not used
exports.searchRoutesMonthly = async ( req, res, next ) =>{

    console.log( req.body )
    var date1 = new Date()
    var date2 = new Date(date1.getFullYear(), today.getMonth()-1, today.getDate())
    
    const promiseInvoices = [{}]
    const rout = await Route.findAll({ where: { date: { [Op.between]: [date1, date2]  } }
    }).then( result => {
        async()=>{

        
        for await (const hash of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
            const log = await wastesSmartContract(hash) 
            console.log(log)
           let w = {}
            
                w.date= rout.date,
                w.vehicle= rout.vehicle,
                w.coords= rout.coords,
                w.kg= rout.kg,
                w.time = rout.time,
                
                w.driver= log.driver,
                w.location= log.location,
                
                w.routebinid= log.routebinid
            
            console.log( w )
            promiseInvoices.push( w )
        }
        }
    })
    res.send( promiseInvoices )

}


//prints the routes table with the map, not used currently ->only testing
exports.printRoutes = async ( req, res, next ) => {

    console.log( req.body )
        let options = { format: 'A4'}
        let file = { url: 'http://127.0.0.1:5500/app/map/map.html' }
        

        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
        console.log('PDF Buffer:-', pdfBuffer)
        fs.writeFileSync('createdWastesPdf.pdf',pdfBuffer)

    })
}
//https://pspdfkit.com/blog/2021/how-to-generate-pdf-from-html-with-nodejs/

//shows all routes in the database test purposes
exports.showAllRoutes = async ( req, res, next )=>{
    
        const routes = await Routes.findAll()
        console.log(routes.every( routes => route instanceof Route )) // true
        console.log("All routes:", JSON.stringify( routes, null, 2 ))
        res.send(JSON.stringify( routes, null, 2 ))
     
}


exports.csvRoutes = async ( req, res, next ) => {
   
    console.log( req.body )
       
    expCSV()

}