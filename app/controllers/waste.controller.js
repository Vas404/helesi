//Definitions
// const express = require("express");
const db = require("../models");
// const internalIp = require('internal-ip');
const Waste = db.wastes;
const Op = db.Sequelize.Op;
const exec = require('child_process').exec;

var bs58 = require('bs58');
var CryptoJS = require("crypto-js");

// Create and Save a new document
exports.create = (req, res) => {

  var date=req.body.date
  var time=req.body.time
  var vechicle=req.body.vechicle
  var driver=req.body.driver
  var location=req.body.location
  var coords=req.body.coords
  var kg=req.body.kg
  var route=req.body.route
  var pass=req.body.pass
  var type=req.body.type
  var material=req.body.material
  var quality=req.body.quality
  var inst_c=req.body.code_inst
  var bin=req.body.bin_id
  var string_waste = route+driver+date+vechicle+time+location+coords+kg+route+pass+type+material+quality+inst_c+bin;
  var encrypted = CryptoJS.SHA256(string_waste).toString();
  var hash_waste = bs58.encode(new Buffer(encrypted, 'hex'));
 console.log("hash waste "+hash_waste);

  const waste =
        {
          date:req.body.date,
          time:req.body.time,
          vechicle:req.body.vechicle,
          driver:req.body.driver,
          location:req.body.location,
          coords:req.body.coords,
          kg:req.body.kg,
          route:req.body.route,
          pass:req.body.pass,
          type:req.body.type,
          material:req.body.material,
          quality:req.body.quality,
          INSTAL_C:req.body.code_inst,
          BIN_ID:req.body.bin_id,
          hash:hash_waste
        }

        fetch('http://94.66.5.210:3339/hash/'+hash_waste+'/encoding/base58')
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
                 hash:hash_waste,
                 encoding:'base58'
               })
            })
            .then(response =>{
              if (response.status==200)
              {
                Waste.create(waste).then(data =>
                  {
                    value={
                      hash:hash_waste,
                      address:"http://95.216.162.109/checkqr/"
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
      


        // fetch('http://94.66.5.210:3339/hash/'+hash_waste+'/encoding/base58')
        // .then(response => response.json())
        //   .then(data_1 => {

        //   res.send("entry already exists");
        //   }).catch(err => {

        //     fetch ("http://94.66.5.210:3339//hash/",{
        //       method:"post",
        //       headers:{
        //         'Accept':'application/json',
        //         'Content-Type':'application/json'
        //        },
        //        body:JSON.stringify({ 
        //          hash:hash_waste,
        //          encoding:'base58'
        //        })
        //     })
        //     .then ((response)=>
        //     {
        //       if(response)
        //       {
        //         Waste.create(waste).then(data =>
        //           {
        //             value={
        //               hash:hash_waste,
        //               address:"http://localhost:62625/checkqr/"
        //             }
    
        //             res.send(value);
                    
        //           }).catch(err =>
        //             {
        //               res.send("Entry not created");
        //             })
        //       }
        //       else{
        //         res.send("Hash not created");
        //           }
        //     })
        // });

// Saves the document in the database
};
/////////////////////////////////////////////////////////////////////////

exports.findOne = (req, res) => {
  //Searches if the hash exists in the blockchain
  var hash = req.params.id; 
  //LTO fetch get request
  fetch('http://95.216.162.109/api/users/'+hash)
    .then(response => response.json())
      .then(data=>{
        if(data){
        console.log('ok');
        User.findAll({
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
};

//find client's dept
exports.updateWasteDB = (req, res) => {
  //Find DB request in order to find all entries with empty hash
  Waste.findAll({
    where:{ 
      hash:req.params.hash = ''
    } 
  }).then(data => {
    //For iteration in order to update each result from the findAll request
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
        info={"hash":hash};
        // Start of update request with the newly created hash
        Waste.update(info, {
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
                console.log('hash is '+ hash);
                //if response is true then create the DB entry
                console.log('Success');
                //create a user in the DB according to the constructor
              }
              else{
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

/////////////////////////////////////////////////////////////////////////////////////
//find documents public access
exports.check = (req, res) => {  
  var hash = req.params.id; 
  console.log(hash);
  //fetch('http://77.69.37.69:62627/api/users/check/'+hash)
 // .then(response => response.json())
   // .then(data=>{
     // if(data){
        Waste.findAll({
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
            })
         // }else if (!data){
       //     res.send(false);
       //   }

      //}).catch(err => {
      //  console.log('hash does not exist');
     //   res.send(false);
     // });
};


// convert ejs page to pdf (ejs generated by SetPrintFile function)
exports.Print = (req, res) => {
      id=req.params.id;

      User.findAll({
        where:{
          id:id} 
         })
       .then (data => {
        fetch('http://95.216.162.109/api/v1/print', {
          method: 'post',
          body:    JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
          .then(data=>{
            res.send(data);
    
       }).catch(err => {
      console.log('hash does not exist');
      res.send(err);
       });


      })     
      .catch(err => {
            res.status(500).send({
            });
          });  
  };

//=========================================================================================

// find all published documents. NOT USED
exports.findAllPublished = (req, res) => {
  User.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Retrieve all documents from the database. NOT USED
exports.findAll = (req, res) => {
  const company_name  = req.query.company_name;
  var condition = company_name? { company_name: { [Op.like]: `%${company_name }%` } } : null;

  User.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

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
//========================================================================================