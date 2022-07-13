const db = require("../models");
const Routes = db.routes;
//const Routes = db.routes;
const Op = db.Sequelize.Op;
const exec = require('child_process').exec;
const puppeteer = require("puppeteer");
var bs58 = require('bs58');
var CryptoJS = require("crypto-js");
const { check } = require("./routes_report.controller");
const { rejects } = require("assert");


exports.routesReport = (req, res) => {
  console.log("hello from routesReport controller")
  //set dates to variables from front-end
  var errors = [];
  var error_sent=[];
  var check=false;
  var array=[];
  let bool=true;
  let count=0;
  var startday = req.headers.startday;
  var endday = req.headers.endday;
  //console.log("startday:"+startday);
 // console.log("endday:"+endday);
  var data_report;
  // Search if entries within the dates exist in DB
  Routes.findAll({
      where:{
          date: {
              [Op.between]: [startday, endday]
          }
      }         
  }).then(data => {
      data_report=data;
      //Define the loop that will create each hash
	console.log("data report: data length:", data.length);

      for(i=0; i<(data.length); i++){
          //Define variables that will create the hash
          var driver = data[i].driver;
          var vehicle = data[i].vechicle;
          var date = data[i].date;   
          var time=data[i].time; 
          var location=data[i].location;
          var coords=data[i].coords;
          var kg=data[i].kg;
          var bin=data[i].routebinid;
       
          //encode hash
          var string = date+time+vehicle+driver+location+kg+bin+coords;
          var encrypted = CryptoJS.SHA256(string).toString();
          var hash = bs58.encode(new Buffer(encrypted, 'hex'));
                    
          // make the fetch GET request to LTO

          // console.log("------"+array.push(request(hash,data[i].id)));
          // console.log("--i--:"+i+"" +hash);
          //array.push(request(hash,data[i].id)) -> fill with the id returned from the lto
          
          
         // array[i]=JSON.stringify(value).replace(/[\[\]']+/g, '');
        //  console.log("----data here:------"+JSON.stringify(array).replace(/[\[\]']+/g, ''));

      };
      
       Promise.all(array).then(values => {  
         values.forEach(element => 
          errors.push(element.replace(/[\[\]\"']+/g, '')));
         // console.log("----here----"+element.replace(/[\[\]\"']+/g, '')));    
         //errors.push(JSON.stringify(values).replace(/[\[\]\"']+/g, ''));  
         //console.log(errors.length);
         count++;
        // if(count===errors.length){

          res.send({"errors":errors,"data_report":data_report});
         
        })
      
      //console.log("errors1:"+errors.length);
     // console.log("data_report:"+data_report.length);
     // res.send({"errors":errors,"data_report":data_report});
       
    
  //Sequelize DB requset error handler    
  }).catch(err => {
   // console.log("errors2 on system:" +i);
      //res.status(500).send({
        //  message:
        
        //  err.message || "Some error occurred while retrieving User."
     // });
  });

     
  
};


// async function request (hash,i) {
//     let data_return=[];
//    await fetch('http://94.66.5.210:3339/hash/'+hash+'/encoding/base58')
//   .then(response => {
//     if(response.status==200)
//     {
//       console.log("entry exists")
//     }
//     else{
//       data_return.push(i);
//     }
//   })
 
//   console.log(JSON.stringify(data_return));
//   let data_2=JSON.stringify(data_return);
//   return data_2;

// }


///////////////////////print report/////////////////////////////////////////////////////
  exports.SetPrintFileRoutes = (req, res) => {
    var errors = [];
    var array=[];
     var string=req.params.params;
   console.log(string)
    var startday = string.split("startday=")[1].split("&")[0];
    //console.log(startday);
    var endday = string.split("endday=")[1].split("=")[0];
   // console.log(endday);
    //console.log(endday);
    var data_report;
    // Search if entries within the dates exist in DB
    Routes.findAll({
        where:{
            date: {
                [Op.between]: [startday, endday]
            }
        }         
    }).then(data => {
        //data_report=data;
        //console.log(data)
        //Define the loop that will create each hash
        for(i=0; i<(data.length); i++){
            //Define variables that will create the hash
            var driver = data[i].driver;
            var vehicle = data[i].vehicle;
            var date = data[i].date;   
            var time=data[i].time; 
            var location=data[i].location;
            var coords=data[i].coords;
            var kg=data[i].kg;
            var routes=data[i].routebinid;
         
            //encode hash
            var string = driver+date+vehicle+time+location+coords+kg+routes;
            var encrypted = CryptoJS.SHA256(string).toString();
            var hash = bs58.encode(new Buffer(encrypted, 'hex'));
                      
            // make the fetch GET request to LTO
  
            // console.log("------"+array.push(request(hash,data[i].id)));
             //console.log("--test----");
            array.push(request(hash,data[i].id))
            
        };
        console.log(array[1])
         async ()=>{
           console.log('mphka')
           (array).then(values => {  
           values.forEach(element => 
            errors.push(element.replace(/[\[\]\"']+/g, '')));
           // console.log("----here----"+element.replace(/[\[\]\"']+/g, '')));    
           //errors.push(JSON.stringify(values).replace(/[\[\]\"']+/g, ''));  
           //console.log("errors.length");
          console.log(array[1])
          // if(count===errors.length){
 
            res.render('pages/routes_report.ejs',{
              data:data_report,
              errors:errors
            });
           
          })
        }
       
      
    //Sequelize DB requset error handler    
    }).catch(err => {
  
    }); 
    } 
  
  // convert ejs page to pdf (ejs generated by SetPrintFile function)
  exports.PrintRoutes = (req, res) => {
        //id=5;
        var startday=req.headers["startday"]; 
        var endday=req.headers["endday"]; 
        var params = "startday="+startday+"&endday="+endday;
        //console.log(params);
        (async () => {
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
        
          const page = await browser.newPage() 
          await page.setDefaultNavigationTimeout(0)
          await page.goto('http://95.216.162.109:443/setprintroute/'+params)
        
          const options = {
            //path: 'pdf/filename.pdf',
            format: 'A4',
            printBackground: true,
            landscape: true,
          }
          const buffer = await page.pdf(options)
          res.type('application/pdf')
          browser.close()
          res.send(buffer) 
      })()   
    };
  



    ////////////////// print single entry  //////////////////////////////////


    exports.SetPrintFileSingleRoutes = (req, res) => {
      var id=req.params.id;
     
      Routes.findOne({
        where:{
          id:id} 
         })
       .then (data => {
          // console.log(data);

          //Define variables that will create the hash
          var driver = data.driver;
          var vehicle = data.vechicle;
          var date = data.date;   
          var time=data.time; 
          var location=data.location;
          var coords=data.coords;
          var kg=data.kg;
          var routes=data.routebinid;
       
          //encode hash
          var string = driver+date+vehicle+time+location+coords+kg+routes;
          var encrypted = CryptoJS.SHA256(string).toString();
          var hash = bs58.encode(new Buffer(encrypted, 'hex'));
          console.log(hash);
          //console.log(data[0].driver);  
          // make the fetch GET request to LTO -> tha allajei sto kainourgio, de douleyei atm
          // fetch('http://94.66.5.210:3339/hash/'+hash+'/encoding/base58')
          // .then(response => {
          //   if(response.status==200){
          //      const templateData = {
          //       date: data[0].date,
          //       time:data[0].time,
          //       hash:hash,
          //       vechicle:data[0].vechicle,
          //       driver:data[0].driver,
          //       location1:data[0].location,
          //       coords:data[0].coords,
          //       routebinid:data[0].routebinid
          //      };
          
          const templateData = {
                  date: data.date,
                  time:data.time,
                  hash:hash,
                  vechicle:data.vechicle,
                  driver:data.driver,
                  location1:data.location,
                  coords:data.coords,
                  routebinid:data.routebinid
                 }
                res.render('pages/singlereport_router.ejs',templateData);

            //}
            // else if(response.status==404)
            // {
            //   const templateData_error = {
            //     date: data[0].date,
            //     time:data[0].time,
            //     hash:hash,
            //     vechicle:data[0].vechicle,
            //     driver:data[0].driver,
            //     location1:data[0].location,
            //     coords:data[0].coords,
            //     routebinid:data[0].routebinid,
            //     error:'Η καταχώρηση δεν είναι έγκυρη'
            //    };
            //   // console.log(templateData);
            //     res.render('pages/singlereport_router_error.ejs',templateData_error);
  
            // }
          })   
      .catch(err => {
            res.status(500).send({
            message:"err"
            });
          });  
       
     }//)

// };


    // convert ejs page to pdf (ejs generated by SetPrintFile function)
    exports.PrintSingleRoutes = (req, res) => {
          var id=req.headers["id"]; 
          console.log(id);
          (async () => {
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
          
            const page = await browser.newPage() ;   
            await page.goto('http://95.216.162.109:443/setsingleroute/'+id,{
              waitUntil: 'load',
              //timeout: 0
            });
            const buffer = await page.pdf({format: 'A4'});
            res.type('application/pdf');
            browser.close();
            res.send(buffer) ; 
        })()   
      };
////////////check_qr----------





exports.check_routes = (req, res) => {  
  var hash = req.params.id; 
  //console.log(hash);
  //fetch('http://77.69.37.69:62627/api/users/check/'+hash)
 // .then(response => response.json())
   // .then(data=>{
     // if(data){
        Routes.findAll({
          where:{
            hash:req.params.id} 
           })
         .then(data => {
          console.log(hash);
          // var driver = data[0].driver;
          // var vehicle = data[0].vechicle;
          // var date = data[0].date;
          // var id=data[0].id;
          // //encode hash
          // var string = driver+date+vehicle+id;
          // var encrypted = CryptoJS.SHA256(string).toString();
          // var hash = bs58.encode(new Buffer(encrypted, 'hex'));

          fetch('http://94.66.5.210:3339/hash/'+hash+'/encoding/base58')
          .then(response => {
            if(response.status==200)
            {
              res.send(data);
            }
            else{
              res.send(false);
            }
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while retrieving data."
               });
             })
        
         // }else if (!data){
       //     res.send(false);
       //   }

      //}).catch(err => {
      //  console.log('hash does not exist');
     //   res.send(false);
     // });
  })

}





      /////////////////////////////END////////////////////////////////////////////////