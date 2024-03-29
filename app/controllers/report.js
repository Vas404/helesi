const db = require("../models")
const Waste = db.wastes
const Routes = db.routes
const testing_waste=db.testing_waste;
const Op = db.Sequelize.Op
const exec = require('child_process').exec;
const puppeteer = require("puppeteer")
var bs58 = require('bs58')
var CryptoJS = require("crypto-js")
const { check } = require("./wastes")
const { setUncaughtExceptionCaptureCallback, off } = require("process")
const { routesReport } = require("./routes_report.controller")
const dec = require('../lib/decoder')



exports.wasteReport = (req, res) => {
  console.log(req.headers)
  const decoded = dec.decode(req.headers["authorization"])
  const adminId = decoded['adminId']
  const role = decoded['role'] 
  if(role === 'user'){
       
      console.log(role)
      console.log(adminId)
     
  }
  var errors = []
  var array=[]
  var startday = req.headers.startday
  var endday = req.headers.endday
  console.log("startday:" + startday )
  console.log("endday:" + endday )
  var data_report
  // Search if entries within the dates exist in DB
  Waste.findAll({
      where:{
          date: {
              [Op.between]: [startday, endday]
          },adminId:adminId
      }         
  }).then(data => {
   // console.log(data)
      data_report=data
      console.log(data)
    
      for(i=0; i<(data.length); i++){
         
          var hash = data[i].hash
      
            
          array.push(request(hash,data[i].id))
          
      };
      
       Promise.all(array).then(values => {  
         values.forEach(element => 
          errors.push(element.replace(/[\[\]\"']+/g, '')))
         

          res.send({"errors":errors,"data_report":data_report})
         
        })
     
    })
}


exports.check = (req, res) => {  
  var hash = req.params.id;

        Waste.findAll({
          where:{
            hash:req.params.id} 
           })
         .then(data => {
         
          fetch('https://testnet-indexer.ltonod.es//hash/'+hash+'/encoding/base58')
          .then(response => {
            if (response.status==200)
            { res.send(data)}
            else if(response.status==404)
            { res.send(false)} 

          })
         .catch(err => {
           res.status(500).send({
             message:
               err.message || "Some error occurred while retrieving data."
              })
            })
  
            })
}



async function request (hash,i) {
    let data_return=[]

//was http://94.66.5.210:3339/hash
    await fetch('https://testnet-indexer.ltonod.es/hash/'+hash+'/encoding/base58')
   .then(response=>{
    if(response.status==200)
    {console.log("exists")
      data_return.push(-1)}
    else{
      data_return.push(i)
    }

    })


  let data_2=JSON.stringify(data_return)
  return data_2;

}





///////////////////////print report/////////////////////////////////////////////////////
  exports.SetPrintFileWaste = async (req, res) => {
    var errors = []
    var array=[]
    //console.log(req.headers)
    
    var string=req.params.params
    console.log(string)
    
    var startday = string.split("startday=")[1].split("&")[0]
    console.log(startday);
    var endday = string.split("endday=")[1].split("+")[0]
    console.log(endday);
    var adminId = string.split("adminId=")[1].split("=")[0]
    //console.log(endday);
    var data_report;
    // Search if entries within the dates exist in DB
   await Waste.findAll({
        where:{
            date: {
                [Op.between]: [startday, endday]
            }, adminId: adminId
        }         
    }).then(data => {
        data_report=JSON.stringify(data)
        console.log(data_report)
        var errors = []
        
             res.render('pages/report',{
              data:data_report,
              errors:errors
            })
   
    }).catch(err => {
  
    })
      
    } 

//////set print file routes////////////////////
exports.SetPrintFileRoutes = async (req, res) => {
  var errors = []
  var array=[]
  //console.log(req.headers)
  
  var string=req.params.params
  console.log(string)
  
  var startday = string.split("startday=")[1].split("&")[0]
  console.log(startday);
  var endday = string.split("endday=")[1].split("=")[0]
  console.log(endday);
  //console.log(endday);
  var data_report;
  // Search if entries within the dates exist in DB
 await Routes.findAll({
      where:{
          date: {
              [Op.between]: [startday, endday]
          }
      }         
  }).then(data => {
      data_report=JSON.stringify(data)
      console.log(data_report)
      
      

           res.render('pages/routes_report',{
            data:data_report,
            errors:errors
          })
      
     
    
  //Sequelize DB requset error handler    
  }).catch(err => {

  })
    
  } 

   
  
  // convert ejs page to pdf (ejs generated by SetPrintFile function)
  exports.PrintWaste = (req, res) => {
        //id=5;
       
        (async () => {
        console.log(req.headers)
        const decoded = dec.decode(req.headers["authorization"])
        const adminId = decoded['adminId']
        var startday=req.headers["startday"];
        console.log(startday)
        var endday=req.headers["endday"]
        console.log(endday) 
        
       
        
        var params = "startday="+startday+"&endday="+endday+"+adminId="+adminId
        console.log("here")
        console.log(params)
          const browser = await puppeteer.launch({
         
              headless: true,
              ignoreHTTPSErrors: true,
             args: ['--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--window-size=1400,900',
          '--ignore-certifcate-errors-spki-list',],
          });
          //was http://77.69.37.69:62625/api/v1/setprintwaste/
          const page = await browser.newPage()   
          await page.goto('http://95.216.162.109:443/setprintwaste/'+params)
          const options = {
            //path: 'pdf/filename.pdf',
            format: 'A4',
            printBackground: true,
            landscape: true,
          }
         //console.log("---------------------")
          const buffer = await page.pdf(options)
          res.type('application/pdf')
          browser.close()
          res.send(buffer) 
      })()   
    }
  ////////////////////////same routes////////////////////////////////////////
  exports.PrintRoutes = (req, res) => {
    //id=5;
   
    (async () => {
    console.log(req.headers)
    var startday=req.headers["startday"];
    console.log(startday)
    var endday=req.headers["endday"]
    console.log(endday) 
    var params = "startday="+startday+"&endday="+endday
    console.log("here")
    console.log(params)
      const browser = await puppeteer.launch({
     
          headless: true,
          ignoreHTTPSErrors: true,
         args: ['--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--window-size=1400,900',
      '--ignore-certifcate-errors-spki-list',],
      });
      //was http://77.69.37.69:62625/api/v1/setprintwaste/
      const page = await browser.newPage()   
      await page.goto('http://95.216.162.109:443/setprintroutes/'+params)
      const options = {
        //path: 'pdf/filename.pdf',
        format: 'A4',
        printBackground: true,
        landscape: true,
      }
     //console.log("---------------------")
      const buffer = await page.pdf(options)
      res.type('application/pdf')
      browser.close()
      res.send(buffer) 
  })()   
}

    ////////////////// print single entry  //////////////////////////////////
//exw vgalei to lto kommati
    exports.SetPrintFileSingleWaste = async (req, res) => {
      var id=req.params.id
      var correct_id=[]
      Waste.findOne({
        where:{
          id:id} 
         })
       .then (data =>{
        console.log(data);
        console.log(data.time)

       //console.log(data);
          //Define variables that will create the hash
          var driver = data.driver
          var vehicle = data.vehicle
          var date = data.date
          var hash = data.hash
          var time=data.time 
          var location=data.location
          var coordinates=data.coords
          var kg=data.kg
          var route=data.route
          var pass=data.pass
          var type=data.type
          var material=data.material
          var quality=data.quality
          
          //encode hash
          var string = route+driver+date+vehicle+time+location+coordinates+kg+route+pass+type+material+quality
          var encoding = 'base58'
          console.log(hash)
          console.log(encoding)
        
              const templateData = {
                date: data.date,
                time:data.time,
                vehicle:data.vehicle,
                driver:data.driver,
                location:data.location,
                hash:data.hash,
                coords:data.coords,
                kg:data.kg,
                route:data.route,
                pass:data.pass,
                type:data.type,
                material:data.material,
                quality:data.quality, 
               
               }
                //console.log(response.status)
                console.log(templateData)
                //console.log(rawResponse)
                res.render('pages/singlereport',templateData)
            })
    
      .catch(err => {
            res.status(500).send({
            
            })
          }) 
       
    } 
    // convert ejs page to pdf (ejs generated by SetPrintFile function)
    exports.PrintSingleWaste = (req, res) => {
         
        // console.log(id)
          (async () => { 
            var id=req.headers["id"] 
            const browser = await puppeteer.launch({
          
              headless: true,
              ignoreHTTPSErrors: true,
          args: ['--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--window-size=1400,900',
          '--ignore-certifcate-errors-spki-list'],
                  })
          
            const page = await browser.newPage()   
            await page.goto('http://95.216.162.109:443/setsinglewaste/'+id)
            const buffer = await page.pdf({format: 'A4'})
            res.type('application/pdf')
            browser.close()
            res.send(buffer) 
        })()   
      }


      /////////////////////////////END////////////////////////////////////////////////
      exports.routesReport = (req, res) => {
  
        var errors = []
        var array=[]
        var startday = req.headers.startday
        var endday = req.headers.endday
        console.log("startday:" + startday )
        console.log("endday:" + endday )
        var data_report
        // Search if entries within the dates exist in DB
        Routes.findAll({
            where:{
                date: {
                    [Op.between]: [startday, endday]
                }
            }         
        }).then(data => {
         // console.log(data)
            data_report=data
            //Define the loop that will create each hash
            for(i=0; i<(data.length); i++){
                //Define variables that will create the hash
                var driver = data[i].driver
                var vehicle = data[i].vehicle
                var date = data[i].date   
                var time=data[i].time 
                var location=data[i].location
                var coords=data[i].coords
                console.log(coords)
                console.log(data[i].coords)
                var kg=data[i].kg
      
                var bin=data[i].routebinid
                //encode hash
                var string = driver+date+vehicle+time+location+coords+kg+bin;
                var encrypted = CryptoJS.SHA256(string).toString()
                var hash = bs58.encode(new Buffer(encrypted, 'hex'))
                  
                array.push(request(hash,data[i].id))
                
            };
            
             Promise.all(array).then(values => {  
               values.forEach(element => 
                errors.push(element.replace(/[\[\]\"']+/g, '')))
               
      
                res.send({"errors":errors,"data_report":data_report})
               
              })
           
          
        //Sequelize DB requset error handler    
        }).catch(err => {
      
        });
          
        
      };



      //print single route

      exports.PrintSingleRoute = (req, res) => {
         
        // console.log(id)
          (async () => { 
            var id=req.headers["id"] 
            const browser = await puppeteer.launch({
          
              headless: true,
              ignoreHTTPSErrors: true,
          args: ['--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-infobars',
          '--window-position=0,0',
          '--ignore-certifcate-errors',
          '--window-size=1400,900',
          '--ignore-certifcate-errors-spki-list'],
                  })
          
            const page = await browser.newPage()   
            await page.goto('http://95.216.162.109:443/setsingleroute/'+id)
            const buffer = await page.pdf({format: 'A4'})
            res.type('application/pdf')
            browser.close()
            res.send(buffer) 
        })()   
      }


      exports.SetPrintFileSingleRoute = async (req, res) => {
        var id=req.params.id
        var correct_id=[]
        Routes.findOne({
          where:{
            id:id} 
           })
         .then (data =>{
          console.log(data);
          console.log(data.time)
  
         //console.log(data);
            //Define variables that will create the hash
            var driver = data.driver
            var vehicle = data.vehicle
            var date = data.date
            var hash = data.hash
            var time=data.time 
            var location=data.location
            var coords=data.coords
            var kg=data.kg
            var routebinid=data.routebinid
            
            
            //encode hash
            var string = routebinid+driver+date+vehicle+time+location+coords+kg
            var encoding = 'base58'
            console.log(hash)
            console.log(encoding)
           
                const templateData = {
                  date: data.date,
                  time:data.time,
                  vehicle:data.vehicle,
                  driver:data.driver,
                  location1:data.location,
                  hash:data.hash,
                  coords:data.coords,
                  kg:data.kg,
                  routebinid:data.routebinid,
                 
                 
                 }
                  //console.log(response.status)
                  console.log(templateData)
                  //console.log(rawResponse)
                  res.render('pages/singlereport_router',templateData)
              })
    
        .catch(err => {
              res.status(500).send({
              
              })
            }) 
          }