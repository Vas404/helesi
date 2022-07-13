
function htmlToCSV(html, filename) {
  var data = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) {
      row.push(cols[j].innerText);
    }

    data.push(row.join(","));
  }

  downloadCSVFile(data.join("\n"), filename);
}

function downloadCSVFile(csv, filename) {
  var csv_file, download_link;

  csv_file = new Blob([csv], { type: "text/csv" });

  download_link = document.createElement("a");

  download_link.download = filename;

  download_link.href = window.URL.createObjectURL(csv_file);

  download_link.style.display = "none";

  document.body.appendChild(download_link);

  download_link.click();
}
document
  .getElementById("csv")
  .addEventListener("click", function () {
    var html = document.querySelector("table").outerHTML;
    htmlToCSV(html, "wastes.csv");
  });


var startday;
var endday;


$("#range").click(function () {
//document.getElementById("routes").style.display="none";
startday = document.getElementById("start").value;
endday = document.getElementById("end").value;
console.log(startday);
console.log(endday);
//set the values from the fields into variables
// var owner_name = document.getElementById('owner_name').value;
// var owner_surname = document.getElementById("owner_surname").value;
// var afm = document.getElementById("afm").value;
//ajax GET request to DB with hash A
const token = window.localStorage.getItem('token')
const token2 = JSON.parse(token)
$.ajax({
url: "/wastereport",
type: "POST",
dataType: "json",
headers: { startday: startday, endday: endday , ["Authorization"]: token2.token },
success: function (result) {
console.log(result);
//ajax GET request to DB with hash DATA
if (Object.keys(result.data_report).length !== 0) {
  //Set the result data from DB to a global variable
  //dataprint = result;

  $("#table tr").not(":first").remove();
  $("#table ul").empty();

  document.getElementById("show_table").style.display = "block";
  document.getElementById("print").style.display = "block";
  document.getElementById("csv").style.display = "block";
  // document.getElementById("printdept").style.display="block";
  //var counter=1;
  //var errors={"id":3};
  //console.log(Object.keys(errors).length);
  if (Object.keys(result.errors).length !== 0) {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      //console.log("---------------"+result.errors[i]);
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;

      if (
        result.errors.indexOf(
          JSON.stringify(result.data_report[i - 1].id)
        ) !== -1
      ) {
        //console.log("-----!!!!!1");
        table.rows[i].style.backgroundColor = "#8B0000";
        table.rows[i].style.color = "#FFFFFF";
      }
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        //console.log("---id:---"+id);
        //console.log(userid);
        printEntry(userid);
      });
  } else {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  }
} else {
  // document.getElementById("show_table").style.display="none";
  // document.getElementById("printdept").style.display="none";
  window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
}
},
error: function (result) {
window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
},
});

return false;
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#week").click(function () {
//document.getElementById("routes").style.display="none";
function getMonday(d) {
d = new Date(d);
var day = d.getDay(),
diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
var date = new Date(d.setDate(diff));
(month = "" + (date.getMonth() + 1)),
(day = "" + date.getDate()),
(year = date.getFullYear());

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

function currentday() {
var d = new Date(),
month = "" + (d.getMonth() + 1),
day = "" + d.getDate(),
year = d.getFullYear();

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

startday = getMonday(new Date());
endday = currentday();
console.log(startday);
console.log(endday);
//set the values from the fields into variables
// var owner_name = document.getElementById('owner_name').value;
// var owner_surname = document.getElementById("owner_surname").value;
// var afm = document.getElementById("afm").value;
//ajax GET request to DB with hash A
const token = window.localStorage.getItem('token')
const token2 = JSON.parse(token)
$.ajax({
url: "/wastereport",
type: "POST",
dataType: "json",
headers: { startday: startday, endday: endday , ["Authorization"]: token2.token  },
success: function (result) {
console.log(result);
//ajax GET request to DB with hash DATA
if (Object.keys(result.data_report).length !== 0) {
  //Set the result data from DB to a global variable
  dataprint = result;

  $("#table tr").not(":first").remove();
  $("#table ul").empty();

  document.getElementById("show_table").style.display = "block";
  document.getElementById("print").style.display = "block";
  document.getElementById("csv").style.display = "block";

  // document.getElementById("printdept").style.display="block";
  if (Object.keys(result.errors).length !== 0) {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
      var time = row.insertCell(12);
      time.innerHTML = result.data_report[i - 1].time;
      var date = row.insertCell(13);
      date.innerHTML = result.data_report[i - 1].date;

      if (
        result.errors.indexOf(
          JSON.stringify(result.data_report[i - 1].id)
        ) !== -1
      ) {
        console.log("-----!!!!!1");
        table.rows[i].style.color = "#FFFFFF";
        table.rows[i].style.backgroundColor = "#8B0000";
      }
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  } else {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
      var time = row.insertCell(12);
      time.innerHTML = result.data_report[i - 1].time;
      var date = row.insertCell(13);
      date.innerHTML = result.data_report[i - 1].date;
      
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  }
} else {
  // document.getElementById("show_table").style.display="none";
  // document.getElementById("printdept").style.display="none";
  window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
  $("#table tr").not(":first").remove();
  $("#table ul").empty();
}
$("#table")
  .unbind()
  .on("click", "tr", function (e) {
    e.preventDefault();
    var id = $(this).index();
    var userid = result.data_report[id - 1].id;
    //console.log("xeris");
    //console.log(userid);
    printEntry(userid);
  });
},
error: function (result) {
window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
},
});

return false;
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#month").click(function () {
//document.getElementById("routes").style.display="none";
function getMonth(d) {
date = new Date(d);
//   var day = d.getDay(),
// 	  diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
// 	  var date = new Date(d.setDate(diff));
(month = "" + (date.getMonth() + 1)),
(day = "01"),
(year = date.getFullYear());

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

function currentday() {
var d = new Date(),
month = "" + (d.getMonth() + 1),
day = "" + d.getDate(),
year = d.getFullYear();

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

startday = getMonth(new Date());
endday = currentday();
//console.log(startday);
//console.log(endday);
//set the values from the fields into variables
// var owner_name = document.getElementById('owner_name').value;
// var owner_surname = document.getElementById("owner_surname").value;
// var afm = document.getElementById("afm").value;
//ajax GET request to DB with hash A
const token = window.localStorage.getItem('token')
const token2 = JSON.parse(token)
$.ajax({
url: "/wastereport",
type: "POST",
dataType: "json",
headers: { startday: startday, endday: endday , ["Authorization"]: token2.token  },
success: function (result) {
//ajax GET request to DB with hash DATA
if (Object.keys(result.data_report).length !== 0) {
  //Set the result data from DB to a global variable
  //dataprint = result;
  //console.log("------"+result.data_report);
  $("#table tr").not(":first").remove();
  $("#table ul").empty();

  document.getElementById("show_table").style.display = "block";
  document.getElementById("print").style.display = "block";
  document.getElementById("csv").style.display = "block";
  // document.getElementById("printdept").style.display="block";
  if (Object.keys(result.errors).length !== 0) {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;

      if (
        result.errors.indexOf(
          JSON.stringify(result.data_report[i - 1].id)
        ) !== -1
      ) {
        console.log("-----!!!!!1");
        table.rows[i].style.backgroundColor = "#8B0000";
        table.rows[i].style.color = "#FFFFFF";
      }
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        //console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  } else {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
      var time = row.insertCell(12);
      time.innerHTML = result.data_report[i - 1].time;
      var date = row.insertCell(13);
      date.innerHTML = result.data_report[i - 1].date;
    }
    $("#table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        //console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  }
} else {
  // document.getElementById("show_table").style.display="none";
  // document.getElementById("printdept").style.display="none";
  window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
  $("#table tr").not(":first").remove();
  $("#table ul").empty();
}
$("#table")
  .unbind()
  .on("click", "tr", function (e) {
    e.preventDefault();
    var id = $(this).index();
    var userid = result.data_report[id - 1].id;
    //console.log("xeris");
    //console.log(userid);
    printEntry(userid);
  });
},
error: function (result) {
window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
},
});

return false;
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//month_mobile
////////////////////////////////////////////////////////////////////////////////////////////////////////////
$("#month_mobile").click(function () {
//document.getElementById("routes").style.display="none";
function getMonth(d) {
date = new Date(d);
//   var day = d.getDay(),
// 	  diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
// 	  var date = new Date(d.setDate(diff));
(month = "" + (date.getMonth() + 1)),
(day = "01"),
(year = date.getFullYear());

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

function currentday() {
var d = new Date(),
month = "" + (d.getMonth() + 1),
day = "" + d.getDate(),
year = d.getFullYear();

if (month.length < 2) month = "0" + month;
if (day.length < 2) day = "0" + day;
return [year, month, day].join("-");
}

startday = getMonth(new Date());
endday = currentday();
//console.log(startday);
//console.log(endday);
//set the values from the fields into variables
// var owner_name = document.getElementById('owner_name').value;
// var owner_surname = document.getElementById("owner_surname").value;
// var afm = document.getElementById("afm").value;
//ajax GET request to DB with hash A
const token = window.localStorage.getItem('token')
const token2 = JSON.parse(token)
$.ajax({
url: "/wastereport",
type: "POST",
dataType: "json",
headers: { startday: startday, endday: endday , ["Authorization"]: token2.token},
success: function (result) {
//ajax GET request to DB with hash DATA
if (Object.keys(result.data_report).length !== 0) {
  //Set the result data from DB to a global variable
  //dataprint = result;
  //console.log("------"+result.data_report);
  $("#mobile_table tr").not(":first").remove();
  $("#mobile_table ul").empty();

  document.getElementById("show_mobile_table").style.display =
    "block";
  document.getElementById("mobile_print").style.display = "block";
  // document.getElementById("printdept").style.display="block";
  if (Object.keys(result.errors).length !== 0) {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
      var time = row.insertCell(12);
      time.innerHTML = result.data_report[i - 1].time;
      var date = row.insertCell(13);
      date.innerHTML = result.data_report[i - 1].date;

      if (
        result.errors.indexOf(
          JSON.stringify(result.data_report[i - 1].id)
        ) !== -1
      ) {
        console.log("-----!!!!!1");
        table.rows[i].style.backgroundColor = "#8B0000";
      }
    }
    $("#mobile_table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        //console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  } else {
    for (var i = 1; i < $(result.data_report).length + 1; i++) {
      var row = table.insertRow(i);
      var date = row.insertCell(0);
      date.innerHTML = result.data_report[i - 1].date;
      var time = row.insertCell(1);
      time.innerHTML = result.data_report[i - 1].time;
      var vehicle = row.insertCell(2);
      vehicle.innerHTML = result.data_report[i - 1].vehicle;
      var driver = row.insertCell(3);
      driver.innerHTML = result.data_report[i - 1].driver;
      var location = row.insertCell(4);
      location.innerHTML = result.data_report[i - 1].location;
      var coords = row.insertCell(5);
      coords.innerHTML = result.data_report[i - 1].coords;
      var kg = row.insertCell(6);
      kg.innerHTML = result.data_report[i - 1].kg;
      var route = row.insertCell(7);
      route.innerHTML = result.data_report[i - 1].route;
      var pass = row.insertCell(8);
      pass.innerHTML = result.data_report[i - 1].pass;
      var type = row.insertCell(9);
      type.innerHTML = result.data_report[i - 1].type;
      var material = row.insertCell(10);
      material.innerHTML = result.data_report[i - 1].material;
      var quality_rate = row.insertCell(11);
      quality_rate.innerHTML = result.data_report[i - 1].quality;
      var time = row.insertCell(12);
      time.innerHTML = result.data_report[i - 1].time;
      var date = row.insertCell(13);
      date.innerHTML = result.data_report[i - 1].date;
    }
    $("#mobile_table")
      .unbind()
      .on("click", "tr", function (e) {
        e.preventDefault();
        var id = $(this).index();
        var userid = result.data_report[id - 1].id;
        //console.log("xeris");
        //console.log(userid);
        printEntry(userid);
      });
  }
} else {
  // document.getElementById("show_table").style.display="none";
  // document.getElementById("printdept").style.display="none";
  window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
  $("#mobile_table tr").not(":first").remove();
  $("#mobile_table ul").empty();
}
$("#mobile_table")
  .unbind()
  .on("click", "tr", function (e) {
    e.preventDefault();
    var id = $(this).index();
    var userid = result.data_report[id - 1].id;
    //console.log("xeris");
    //console.log(userid);
    printEntry(userid);
  });
},
error: function (result) {
window.alert("Δεν υπάρχει αντίστοιχη καταχώριση");
},
});

return false;
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
function print() {
const token = window.localStorage.getItem('token')
console.log(`this is the window.localStorage.getItem`+token)
const token2 = JSON.parse(token)
console.log(token2)
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// table=document.getElementById("table");
// var length = table.rows.length;
// startday=table.rows[1].cells[1].innerHTML;
// endday=table.rows[length-1].cells[1].innerHTML;
console.log(startday);
console.log(endday);
var pdfsrc = "/printwaste";
//sent a htmlrequest to server
xhr.open("POST", pdfsrc, true);
//server response with a arraybuffer
xhr.responseType = "arraybuffer";
xhr.setRequestHeader("startday", startday);
xhr.setRequestHeader("endday", endday);
xhr.setRequestHeader("authorization",token2.token)

xhr.addEventListener(
"load",
function (evt) {
var data = evt.target.response
// convert arraybuffer into pdf
if (this.status === 200) {
  const blob = new Blob([data], { type: "application/pdf" })
  const blobURL = URL.createObjectURL(blob)
  console.log(data)
  window.open(blobURL, "_blank")
}
},
false
)

xhr.send()
}
$("#print").click(function () {
print()
})

// function csv() {
//   var xhr = new XMLHttpRequest();
//   xhr.withCredentials = true;
//   // table=document.getElementById("table");
//   // var length = table.rows.length;
//   // startday=table.rows[1].cells[1].innerHTML;
//   // endday=table.rows[length-1].cells[1].innerHTML;
//   console.log(startday);
//   console.log(endday);
//   var csvsrc = "/api/users/csv";
//   //sent a htmlrequest to server
//   xhr.open("POST", csvsrc, true);
//   //server response with a arraybuffer
//   xhr.responseType = "arraybuffer";
//   xhr.setRequestHeader("startday", startday);
//   xhr.setRequestHeader("endday", endday);

//   xhr.addEventListener(
//     "load",
//     function (evt) {
//       //var data = evt.target.response;
//       var csvFile = evt.target.response;

//       var csvFileType = evt.target.response.stringify;
//       console.log(csvFileType);

//       var blob = new Blob([csvFile], { type: "text/csv" });
//       var blobURL = URL.createObjectURL(blob);
//       console.log(csvFile);
//       window.open(blobURL, "_blank");
//     },
//     false
//   );

//   xhr.send();
// }
// $("#csv").click(function () {
//   csv();
// });

function printEntry(id) {
//console.log(id);
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// table=document.getElementById("table");
// var length = table.rows.length;
// startday=table.rows[1].cells[1].innerHTML;
// endday=table.rows[length-1].cells[1].innerHTML;
//console.log(startday);
//console.log(endday);
var pdfsrc = "/printsinglewaste";
//sent a htmlrequest to server
xhr.open("POST", pdfsrc, true);
//server response with a arraybuffer
xhr.responseType = "arraybuffer";
xhr.setRequestHeader("id", id);
//xhr.setRequestHeader("endday",endday);

xhr.addEventListener(
"load",
function (evt) {
var data = evt.target.response;
// convert arraybuffer into pdf
if (this.status === 200) {
  const blob = new Blob([data], { type: "application/pdf" });
  const blobURL = URL.createObjectURL(blob);
  console.log(data);
  window.open(blobURL, "_blank");
}
},
false
);
//return false;
xhr.send();
}
/////<<<----------------------///////////////////ends//////////////------------------>///

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mobile print
function mobile_print() {
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// table=document.getElementById("table");
// var length = table.rows.length;
// startday=table.rows[1].cells[1].innerHTML;
// endday=table.rows[length-1].cells[1].innerHTML;
console.log(startday);
console.log(endday);
var pdfsrc = "/printwaste";
//sent a htmlrequest to server
xhr.open("POST", pdfsrc, true);
//server response with a arraybuffer
xhr.responseType = "arraybuffer";
xhr.setRequestHeader("startday", startday);
xhr.setRequestHeader("endday", endday);

xhr.addEventListener(
"load",
function (evt) {
var data = evt.target.response;
// convert arraybuffer into pdf
if (this.status === 200) {
  const blob = new Blob([data], { type: "application/pdf" });
  const blobURL = URL.createObjectURL(blob);
  console.log(data);
  window.open(blobURL, "_blank");
}
},
false
);

xhr.send();
}
$("#mobile_print").click(function () {
mobile_print();
});

function printEntry(id) {
//console.log(id);
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
// table=document.getElementById("table");
// var length = table.rows.length;
// startday=table.rows[1].cells[1].innerHTML;
// endday=table.rows[length-1].cells[1].innerHTML;
//console.log(startday);
//console.log(endday);
var pdfsrc = "/printsinglewaste";
//sent a htmlrequest to server
xhr.open("POST", pdfsrc, true);
//server response with a arraybuffer
xhr.responseType = "arraybuffer";
xhr.setRequestHeader("id", id);
//xhr.setRequestHeader("endday",endday);

xhr.addEventListener(
"load",
function (evt) {
var data = evt.target.response;
// convert arraybuffer into pdf
if (this.status === 200) {
  const blob = new Blob([data], { type: "application/pdf" });
  const blobURL = URL.createObjectURL(blob);
  console.log(data);
  window.open(blobURL, "_blank");
}
},
false
);
//return false;
xhr.send();
}
