var express = require("express");
var path = require("path");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var tables = [];
var waiting = [];

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "home.html"));
});

app.get("/tables", function(req, res) {
  res.sendFile(path.join(__dirname, "views.html"));
});

app.get("/reserve", function(req, res) {
  res.sendFile(path.join(__dirname, "reservation.html"));
});

app.get("/api/tables", function(req, res) {
  res.json(tables);

});

app.get("/api/waiting", function(req, res) {
  res.json(waiting);
});

app.post("/api/tables", function(req, res) {
  updateSeating();
  var currentTable = req.body;
  if (tables.length < 5) {
    tables.push(currentTable);
    return res.json(tables);
  } else {
    waiting.push(currentTable);
    return res.json(tables);
  }
});


function updateSeating() {

  if (tables.length < 5 && waiting.length > 0) {

    var toSeat = 5 - tables.length;
    for (var i = 0; i < Math.min(toSeat, waiting.length); i++) {
      tables.push(waiting[i]);
    }
    waiting.splice(0, toSeat);
  }

};

app.delete("/api/tables", function(req, res) {
  tables = [];
  updateSeating();
  res.json(tables);
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
