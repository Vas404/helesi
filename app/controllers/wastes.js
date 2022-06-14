const db = require('../models')
const Waste = db.wastes
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
var CryptoJS = require("crypto-js");
const { response } = require('../../server')
const dec = require('../lib/decoder')
//<------ create Waste log ----->

// Anchor dependencies
const { sha256 }            = require('js-sha256');
const bs58                  = require('bs58');
const { anchor, broadcast}  = require('@lto-network/lto-transactions');
const { LTO }               = require('lto-api');
// Account
account_seed = process.env.LTO_ACCOUNT_SEED
account_public_address = process.env.LTO_ACCOUNT_PUBLIC_ADDRESS

var anchorHash;

exports.createWaste = async ( req, res ,next ) => {
    console.log( req.body )
    console.log(req.headers)
    const decoded = dec.decode(req.headers["authorization"])
    const adminId = decoded['adminId']
    const role = decoded['role'] 
    if(role === 'user'){
         
        console.log(role)
        console.log(adminId)
       
    }
    var waste = {
        date: req.body.date,
        time: req.body.time,
        driver: req.body.driver,
        location: req.body.location,
        kg: req.body.kg,
        route: req.body.route,
        pass: req.body.pass,
        type: req.body.type,
        vehicle: req.body.vehicle,
        coords: req.body.coords,
        material: req.body.material,
        quality: req.body.quality,
        type: req.body.type,
        hash: anchorHash,
        adminId: adminId

    }
           
            
                fetch(`https://testnet-node.ltonod.es/addresses/balance/${account_public_address}`)
            .then(response => response.json())
            .then(async data => {
                console.log("Account Balance", data.balance)

                // if balance is lower than 50 lto
                if (data.balance <= 5000000000) {
                    console.log("Account balance is too low to proceed, please contact an admin")
                } else {
                    // Anchor waste's data to LTO Network
                    const ltoPost = async () => {
                        // Create a sha256 hash from the data we want to anchor
                        console.log("waste", waste)
                        wasteData = waste.toString()

                        const dataHash  = sha256.digest(wasteData)
                        const dataBase58Hash = bs58.encode(dataHash);
                        
                        const dataAnchorTx = anchor({ 
                            type: 'ChainpointSHA256v2',
                            anchors: [dataBase58Hash],
                            senderPublicKey: account_public_address,
                        }, account_seed);
                        console.log(dataAnchorTx) // anchor hash: 5SXRH3aqJLTWqgUXMGGzzup16DE3daSNFPnrfwvrr29R
                        
                        anchorHash = dataAnchorTx.anchors[0]
                        console.log("anchorhash",anchorHash)
                        anchorHash = anchorHash.toString()
                        console.log("Anchor hash String", anchorHash)

                        fetch("https://testnet-indexer.ltonod.es/hash",{
                                method: "post",
                                headers:{
                                    "Accept" : "*/*",
                                    "Content-Type": "application/json"
                                },
                             
                                body:JSON.stringify({ 
                                    hash: anchorHash,
                                    encoding: "base58"
                                })
                            })
                            .then(response =>{
                                console.log("POST response", response)
                                console.log("Post to LTO success")
                            
                        waste = {
                            date: req.body.date,
                            time: req.body.time,
                            driver: req.body.driver,
                            location: req.body.location,
                            kg: req.body.kg,
                            route: req.body.route,
                            pass: req.body.pass,
                            type: req.body.type,
                            vehicle: req.body.vehicle,
                            coords: req.body.coords,
                            material: req.body.material,
                            quality: req.body.quality,
                            type: req.body.type,
                            hash: anchorHash,
                            adminId: adminId
                        }
                        Waste.create(waste).then( data => {
                            console.log('Data inserted to db successfuly')
                        })}).catch( err =>{
        res.status(500).send({
             message:
             err.message || 'Some error occured while creating the waste log. '
        })
                    })
                    };
                    await ltoPost();

                    // check if data is hashed and anchor to lto network
                    // =>  https://testnet-indexer.ltonod.es/hash/5SXRH3aqJLTeqgUXMGGzzup16DE3daSNFPnrfwvrr29R/encoding/base58
                }
            })

                res.status(200).json({
                    success: true,
                    waste: waste
                })
                   


 }
//<------- eof create Waste log ----->



exports.searchWaste = async ( req, res, next ) =>{

    console.log( req.body )
    const date1 = req.body.date1.getTime()
    const date2 = req.body.date2.getTime()
    const promiseInvoices = [{}]
    const wast = await Waste.findAll( {where: { date: { [Op.between]: [date1, date2]  }}
    }).then( result => {
        async()=>{
        for await (const hash of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
            const log = await fetch('https://testnet-indexer.ltonod.es/hash/'+hash+'/encoding/base58', hash ) 
            console.log( log )
           let w = {}
            
                w.date= wast.date,
                w.vehicle= wast.vehicle,
                w.coords= wast.coords,
                w.weight= wast.weight,
                w.material= wast.material,
                w.blockid= blockid,
                w.driverName= log.driverName,
                w.location= log.location,
                w.route= log.route,
                w.binID= log.binID
            
            console.log( w )
            promiseInvoices.push( w )
        }
            }
    })
    res.send( promiseInvoices )

}

exports.searchWasteWeekly = async ( req, res, next ) =>{

    console.log( req.body )
    var date1 = new Date()
    var date2 = new Date(date1.getFullYear(), today.getMonth(), today.getDate()-7)
    
    const promiseInvoices = [{}]
    const wast = await Waste.findAll({where: { date: { [Op.between]: [date1, date2]  }}
    }).then( result => {
        async() =>{
        for await (const blockId of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
           // const log = await wastesSmartContract( blockid ) lto antistoixa 
            //console.log(log)
           let w = {}
            
                w.date = wast.date,
                w.time = wast.time,
                w.driver = wast.driver,
                w.vehicle = wast.vehicle,
                w.coords = wast.coords,
                w.quality = wast.quality,
                w.weight = wast.weight,
                w.material = wast.material,
                w.routeId = wast.routeId
                w.driverName = log.driverName,
                w.location = log.location,
                w.route = log.route,
                w.BIN_ID= log.BIN_ID
            
            console.log( w )
            promiseInvoices.push( w )
        }
        }
    })
    res.send(promiseInvoices)

}

exports.searchWasteMonthly = async ( req, res, next ) =>{

    console.log( req.body )
    var date1 = new Date()
    var date2 = new Date(date1.getFullYear(), today.getMonth()-1, today.getDate())
    
    const promiseInvoices = [{}]
    const wast = await Waste.findAll({ where: { date: { [Op.between]: [date1, date2]  } }
    }).then( result => {
        async()=>{

        
        for await (const blockId of result){
//https://stackoverflow.com/questions/58714698/query-database-in-array-foreach-sequelize
            // const log = await wastesSmartContract(blockid) 
            // console.log(log) //lto antistoixa
           let w = {}
            
                w.date= wast.date,
                w.vehicle= wast.vehicle,
                w.coords= wast.coords,
                w.weight= wast.weight,
                w.material= wast.material,
                w.blockid= blockid,
                w.driverName= log.driverName,
                w.location= log.location,
                w.route= log.route,
                w.binID= log.binID
            
            console.log( w )
            promiseInvoices.push( w )
        }
        }
    })
    res.send( promiseInvoices )

}


//prints the wastes table
// exports.printWastes = async ( req, res, next ) => {

//     console.log( req.body )
//         let options = { format: 'A4'}
//         let file = { url: 'http://127.0.0.1:5500/app/map/map.html' }
        

//         html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
//         console.log('PDF Buffer:-', pdfBuffer)
//         fs.writeFileSync('createdWastesPdf.pdf',pdfBuffer)

//     })
// }
//https://pspdfkit.com/blog/2021/how-to-generate-pdf-from-html-with-nodejs/

//shows all wastes in the database
exports.showAllWastes = async ( req, res, next )=>{
    
        const wastes = await Wastes.findAll()
        console.log(wastes.every( waste => waste instanceof Waste )) // true
        console.log("All wastes:", JSON.stringify( wastes, null, 2 ))
        res.send(JSON.stringify( wastes, null, 2 ))
     
}


exports.csvWastes = async ( req, res, next ) => {
   
    console.log( req.body )
       
    expCSV()

}