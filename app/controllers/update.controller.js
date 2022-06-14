const db = require("../models");
const Waste = db.wastes;
const Routes = db.routes;
const testing_waste_t = db.testing_waste;
const testing_route_t = db.testing_route;
const Op = db.Sequelize.Op;
const exec = require('child_process').exec;
const puppeteer = require("puppeteer");
var bs58 = require('bs58');
var CryptoJS = require("crypto-js");
const { check } = require("./waste.controller");
const { setUncaughtExceptionCaptureCallback } = require("process");
const { routesReport } = require("./routes_report.controller");



////-------------updateDB----------////
exports.Update=(req,res) =>
{
  var array_router=[];
  var array_waste=[];

  //Routes  UPDATE //////////////

  Routes.findAll({
    where:{
    }
    ,order: [ [ 'date','DESC']]
  }).then(data => {
  
    
        //Define variables that will create the hash
        var date_find = data[0].date;
        //console.log("hmeromhnia: "+date_find);
  
        testing_route_t.findAll({
          where:{
            date: {
              [Op.gt]: date_find,
           },
          }
          
        }).then(data_response => {
  
          for(i=0;i<data_response.length;i++)
         {
          var driver = data_response[i].driver;
          var vehicle = data_response[i].vechicle;
          var date = data_response[i].date;   
          var time=data_response[i].time; 
          var location=data_response[i].location;
          var coords=data_response[i].coords;
          var kg=data_response[i].kg;
          var routes=data_response[i].routebinid;
       
          //encode hash
          var string_route = driver+date+vehicle+time+location+coords+kg+routes;
              
          var encrypted_routes = CryptoJS.SHA256(string_route).toString();
          var hash_routes = bs58.encode(new Buffer(encrypted_routes, 'hex'));
         //console.log("position :"+routes+" hash :"+hash_routes);
          const route =
          {
            date:data_response[i].date,
            time:data_response[i].time,
            vechicle:data_response[i].vechicle,
            driver:data_response[i].driver,
            location:data_response[i].location,
            kg:data_response[i].kg,
            routebinid : data_response[i].routebinid,
            coords : data_response[i].coords,
            hash : hash_routes
  
          }
          array_router.push(request_1(hash_routes));
     
            //console.log("route"+data.response[i].routebinid);
             Routes.create(route).then(data =>
            {
              
             
           
             }).catch(err =>
              {

              })
            
  
          }
  
           Promise.all(array_router).then(values => {  
  
          })
        

  
              }).catch(err => {
  console.log("errors");
        });
                  
  
  //Sequelize DB requset error handler    
  }).catch(err => {
  
  });



///////////////////  WASTE UPDATE/////////////////

  Waste.findAll({
  where:{
  }
  ,order: [ [ 'date','DESC']]
    }).then(data => {

  
      //Define variables that will create the hash
      var date_find = data[0].date;
     // console.log("hmeromhnia: "+date_find);

     testing_waste_t.findAll({
        where:{
          date: {
            [Op.gt]: date_find,
         },
        }
        
      }).then(data_response => {
       // console.log(data_response.length);

        for(i=0;i<data_response.length;i++)
       {

        var driver = data_response[i].driver;
        var vehicle = data_response[i].vechicle;
        var date = data_response[i].date;
        var time=data_response[i].time; 
        var location=data_response[i].location;
        var coords=data_response[i].coords;
        var kg=data_response[i].kg;
        var routes=data_response[i].route;
        var pass=data_response[i].pass;
        var type=data_response[i].type
        var material=data_response[i].material;
        var quality=data_response[i].quality;
        //encode hash
        var string_waste = driver+date+vehicle+time+location+coords+kg+routes+pass+type+material+quality;
        var encrypted = CryptoJS.SHA256(string_waste).toString();
        var hash_waste = bs58.encode(new Buffer(encrypted, 'hex'));

        const waste =
        {
          date:data_response[i].date,
          time:data_response[i].time,
          vechicle:data_response[i].vechicle,
          driver:data_response[i].driver,
          location:data_response[i].location,
          coords:data_response[i].coords,
          kg:data_response[i].kg,
          route:data_response[i].route,
          pass:data_response[i].pass,
          type:data_response[i].type,
          material:data_response[i].material,
          quality:data_response[i].quality,
          hash:hash_waste

        }

        array_waste.push(request_1(hash_waste));
           Waste.create(waste).then(data =>
            {
              console.log("success");
              
           
            }).catch(err =>
              {

              })

            


        }

        Promise.all(array_waste).then(values => {  

          res.send(true);
        })

            }).catch(err => {
                  console.log("errors");
      });
                

//Sequelize DB requset error handler    
}).catch(err => {

});



}



async function request_1 (hash) {
  let data_return=[];
  
    await fetch ("http://94.66.5.210:3339//hash/",{
    method:"post",
    headers:{
      'Accept':'application/json',
      'Content-Type':'application/json'
     },
     body:JSON.stringify({ 
       hash:hash,
       encoding:'base58'
     })
  })
  .then ((response)=>
  {
    if(response)
    {
      //console.log("hash is :"+hash);
      data_return.push(-1);
    }
    else{
      console.log("error occured");
        }
  })

  //console.log(JSON.stringify(data_return));
  let data_2=JSON.stringify(data_return);
  return data_2;

}








      /////////////////////////////END////////////////////////////////////////////////