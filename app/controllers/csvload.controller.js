//Definitions
const express = require("express");
const app = express();
const db = require("../models");
const User = db.users;
const CSVtable = db.csvtables;
const Op = db.Sequelize.Op;
var fs = require('fs');
const exec = require('child_process').exec;
const jsonEval = require('json-eval');
const mysql = require('mysql');
const csv = require('fast-csv');
var Sequelize = require('sequelize');
var formidable= require('formidable');

var sequelize = new Sequelize('testdb', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});


//////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////



exports.upload = (req, res) => {
  //id=req.params.id;
  //console.log(req.params);
  var form = new formidable.IncomingForm();
  form.parse(req);
  // console.log(form);
  //form.uploadDir = path.join(__dirname + '/test');
  form.on('fileBegin', function (name, file){
    file.path = __dirname + '/test/' + file.name;
    //path=file.path;



    
  });

  form.on('file', function (name, file){
    //console.log('Uploaded ' + file.name);
  console.log("filename1");    
      let stream = fs.createReadStream(__dirname + '/test/' + file.name);
      let csvData = [];
      let csvStream = csv
      .parse()
      .on("data", function (data) {
          
          csvData.push(data);
      })
      .on("end", function () {
          // Remove Header ROW
          csvData.shift();

          // Create a connection to the database
         
          // Open the MySQL connection

          //sequelize.query ("insert into csvtables(id,company_name,hash,createdAt,updatedAt) values + (csvData)" );
          // sequelize.query(query, "'34','34','34','2020-08-08','2020-08-08'", (error, response) => {
          //   console.log(error || response);
          // });

          sequelize.query('INSERT INTO csvtables(id,company_name,hash) VALUES ?', {
            replacements: [csvData],
            type: Sequelize.QueryTypes.INSERT,
            
          
          });



          // sequelize.connect((error) => {
          //     if (error) {
          //       console.log("no connection");
          //         console.error(error);
          //     } else {
          //         let query = 'INSERT INTO csvtable (id, address, name, age) VALUES ?';
          //         sequelize.query(query, [csvData], (error, response) => {
          //             console.log(error || response);
          //         });
          //     }
          // });
      });

  stream.pipe(csvStream);
     
//  })

});

res.status(200);
  
};

  





//=========================================================================================

