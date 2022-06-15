//Definitions
const express = require("express");
const app = express();
const db = require("../models");
const Route = db.routes;
const Op = db.Sequelize.Op;
var fs = require('fs');
var os = new os_func();
const exec = require('child_process').exec;
const jsonEval = require('json-eval');
const { routes } = require("../models");
//const puppeteer = require("puppeteer");
const { isNull } = require("util");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var bs58 = require('bs58');
var CryptoJS = require("crypto-js");
const { response } = require("express");

// Create and Save a new Employee
exports.create = (req, res) => {

  var date = req.body.date
  var time=req.body.time
  var vehicle=req.body.vehicle
  var driver=req.body.driver
  var location =req.body.location
  var kg =req.body.kg
  var routebinid=req.body.routebinid
  var coords=req.body.coords

  var string_route = date+time+vehicle+driver+location+kg+routebinid+coords;
  var encrypted = CryptoJS.SHA256(string_route).toString();
  var hash_route = bs58.encode(new Buffer(encrypted, 'hex'));
  





  const route = {
    date : req.body.date,
    time:req.body.time,
    vechicle: req.body.vehicle,
    driver: req.body.driver,
    location : req.body.location,
    kg : req.body.kg,
    routebinid : req.body.routebinid,
    coords : req.body.coords,
    hash : hash_route
  };
  console.log(hash_route)

  fetch('http://94.66.5.210:3339/hash/'+hash_route+'/encoding/base58')
  .then(response => {
    console.log(response)
    if (response.status==200)
    { res.send("Entry already exists");}
    else if (response.status==404)
    {
     fetch ("http://94.66.5.210:3339/hash/",{
        method:"post",
        headers:{
          'Accept':'application/json',
          'Content-Type':'application/json'
         },
         body:JSON.stringify({ 
           hash:hash_route,
           encoding:'base58'
         })
      })
      .then(response =>{
        if (response.status==200)
        {
          Route.create(route).then(data =>
            {
              value={
                hash:hash_route,
                address:"http://95.216.162.109:62625/checkqr_routes/"
              }

              res.send(value);
              
            }).catch(err =>
              {
                res.send("Entry not created");
              })

        }



      })


    }
   
    
  })


}; 

exports.findAll = (req, res) => {
  const name  = req.query.name;
  var condition = name? { name: { [Op.like]: `%${name }%` } } : null;
  
  Route.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving data."
      });
    });
};

//find client's dept
exports.findOne = (req, res) => {

  //require variables from front-end
  //Receive username & password from frontend
  var string = req.params.id;
  var username = string.split("username=")[1].split("&")[0];
  var encrypted = string.split("password=")[1].split("=")[0];
  
  //password should have the hash

  var password = encrypted;
  //console.log(password);
  //Make a fetch request to the LTO network
  
  fetch('http://94.66.5.210:3339//hash/'+password+'/encoding/base58')
    .then(response => {
      if(response.status==200){
        Route.findAll({
          where:{ 
            hash:password
          } 
        }).then(data => {
          //if the received object is not empty the user exists in the DB
          if (Object.keys(data).length !== 0 && data.constructor !== Object){
            //Send true response to the frontend
            res.send(data);
          }else{
            //Send false response to the Backend
            res.send(false);
          }}).catch(err => {
            //Error handling
            res.status(500).send({
              message:
              err.message || "Some error occurred while retrieving the hash."
          });
        }); 
      }
    })
    .catch(err => {
      //if fetch does not receive a response then send a false response to the frontend
      res.send(false);
    });
      
};

//find client's dept
exports.updateDB = (req, res) => {
  //Find DB request in order to find all entries with empty hash
  Route.findAll({
    where:{ 
      hash:req.params.hash = ''
    } 
  }).then(data => {
    //Find DB request in order to find all entries with empty hash
    for(i=0; i<data.length; i++){
      //Define variables that will create hash
      var driver = data[i].driver;
      var vehicle = data[i].vehicle;
      var date = data[i].date;
      var id=data[i].id;
      //create hash
      var string = driver+date+vehicle+id;
      var encrypted = CryptoJS.SHA256(string).toString();
      var hash = bs58.encode(new Buffer(encrypted, 'hex'));
       // Create an object in order to send the hash through the update request
      info={"hash":hash}
       // Create an object in order to send the hash through the update request
      Route.update(info, {
        where: {id:data[i].id}
      }).then(num=>{
          
          if (num ==1){
                     
          }else{
            
          }
        })
        //Fetch LTO POST request in order to post new hash
        fetch("http://94.66.5.210:3339//hash", {
          method: "post",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          //Serialize the JSON body
          body: JSON.stringify({
            hash: hash,
            encoding: 'base58'
          })
        })
        //Get response from fetch request 
        .then( (response) => { 
          //Check if response is true or false
          if (response){
            //console.log('hash is '+ hash);
            //if response is true then create the DB entry
            console.log('Success');
            //create a user in the DB according to the constructor
          }else{
            console.log('An error occured during the creation of the LTO entry');
          }
        })  
      }
      //Send success message
      res.send({
        message: "Hash was updated successfully."
      });
    });
};

//find documents public access
exports.checkroute = (req, res) => {  
  var hash = req.params.id; 
  fetch('http://95.216.162.109/api/users/checkdept/'+hash)
  .then(response => response.json())
    .then(data=>{
      if(data){
        ClientDept.findAll({
          where:{
            hash:req.params.id} 
        })
        .then(data => {
         res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
             err.message || "Some error occurred while retrieving tutorials."
        });
      });
    }else if (!data){
      res.send(false);
    }

}).catch(err => {
  console.log('hash does not exist');
  res.send(false);
});
    
  ClientDept.findAll({
    where:{
      hash:req.params.id} 
     })
   .then(data => {
     res.send(data);
   })
   .catch(err => {
     res.status(500).send({
       message:
         err.message || "Some error occurred while retrieving data."
     });
   });
};


/////////////////////////////////////////////////////////////////////////////////////

// Call ejs page with forms data
// exports.SetPrintFileDept = (req, res) => {
//   var id=req.params.print;
//   console.log('search for print file data in DB');
  
//   ClientDept.findAll({
//     where:{
//       id:id} 
//      })
//    .then (data => {
    
//     const initdate1 = new Date(data[0].createdAt);
//     const dateTimeFormat1 = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'numeric', day: '2-digit' }) 
//     const [{ value: month1 },,{ value: day1 },,{ value: year1 }] = dateTimeFormat1 .formatToParts(initdate1 ) 
//     var createdate = (`${day1}-${month1}-${year1 }`);
    
//       const templateData = {
      
//       hash:data[0].hash,
//       id:data[0].id,
      
//       owner_name:data[0].owner_name,
//       owner_surname:data[0].owner_surname,
//       father_name:data[0].father_name,
      
//       address:data[0].address,
//       address_num:data[0].address_num,
//       afm:data[0].afm,
//       sig_org:data[0].sig_org,
//       sig_id:data[0].sig_id,
//       createdAt:createdate
//     };
//       console.log('send data to html page');
//       res.render('pages/printdept.ejs',templateData);
//   })     
//   .catch(err => {
//         res.status(500).send({
//         });
//       });  
//   } 

// convert ejs page to pdf (ejs generated by SetPrintFile function)
// exports.PrintDept = (req, res) => {
//   console.log('Get data from frontend');
      // id=req.params.id;
      // console.log(id);
      // console.log('deutero vhma');
      // //console.log(id[0].father_name);
      // console.log('Send print data to the controller');
  //     (async () => {
  //       const browser = await puppeteer.launch();
  //       const page = await browser.newPage();   
  //       await page.goto('http://77.69.37.69:62627/api/users/doc/id/dept/'+id);
  //       const buffer = await page.pdf({format: 'A4'});
  //       res.type('application/pdf');
  //       browser.close();
  //       res.send(buffer); 
  // })()   
// };

// Road to pdf print C
// Send data to local server computer)
// exports.sendPrintDept = (req, res) => {

//   console.log('Checkpoint B');
//   const clientDept = {
//     owner_name : req.body.owner_name,
//     owner_surname : req.body.owner_surname,
//     father_name:req.body.father_name,
//     birth_date: req.body.birth_date,
//     afm: req.body.afm,
//     address : req.body.address,
//     address_num : req.body.address_num,
//     sig_org : req.body.sig_org,
//     sig_id : req.body.sig_id
//     //hash : req.body.hash
//   };

//   console.log('Checkpoint C');
      
//   //console.log(name);
//   console.log(clientDept);

//   //console.log(printdata);
//   console.log('Send print data to the local pc controller');

//   //console.log(req.body);
//   //owner_name=req.body.owner_name;
//   //var hash = req.body.hash; 

//   //Search if users wallet allready exists
//   fetch("http://77.69.37.69:62627/api/users/doc/dept/", {
//     method: "post",
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     //Serialize the JSON body
//     body: JSON.stringify(clientDept)
//   })        
// };

exports.PrintDept = (req, res) => {
  id=req.params.id;
  //console.log("print");
  ClientDept.findAll({
    where:{
      id:id} 
     })
   .then (data => {
    fetch('http://95.216.162.109/api/users/print/dept', {
      method: 'post',
      body:    JSON.stringify(data),
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    })
    .then(response => response.arrayBuffer())
      .then(data =>{
        //console.log(data.Uint8Contents);
        res.send(new Buffer (data,"binary"));

   }).catch(err => {
  console.log(err);
  res.send(err);
   });
  

  })     
  .catch(err => {
        res.status(500).send({
        });
      });  
};
/////////////////////////////////////////////////////////////////////////////////////

function os_func() {
  this.execCommand = function (cmd) {
      return new Promise((resolve, reject)=> {
         exec(cmd, (error, stdout, stderr) => {
           if (error) {
              reject(error);
              return;
          }
          resolve(stdout)
         });
     })
 }
}