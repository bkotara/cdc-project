const fs = require("fs");
const express = require('express');
const { parse_csv } = require("./data-parse");

// Setup Data

CACHE_PATH = "cache.json";
DATA = null;

function save_data(data, path) {
	return new Promise((res, rej) => {
		fs.writeFile(path, JSON.stringify(data, null, 4), (err) => {
		    if(err) {
		        return rej(err);
		    }
		    console.log("Data cache saved.");
		    return res();
		});
	});
}

function read_saved_data(path) {
	var rawdata = fs.readFileSync(path);  
	return JSON.parse(rawdata);
}

// Setup express app

var app = express();
var port = 3001;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.param('measure_id', function (req, res, next, measure_id) {
	req.measure_id = measure_id;
  next();
});

app.get('/data/:measure_id', function (req, res, next) {
	var requested_locations = req.query.locations;
	if(typeof requested_locations === "undefined") {
		requested_locations = Array.from({length: Object.keys(DATA.locations).length - 1}, (v, k) => k);
	} else {
		requested_locations = requested_locations.split(',');
	}

	var result = [];
	for (var key of requested_locations) {
		result.push(DATA.data[req.measure_id][key]);
	}
	res.json({"data": result});
});

app.get('/measures', function (req, res) {
  res.json(DATA.measures);
});

app.get('/locations', function (req, res) {
  res.json(DATA.locations);
});

// Start application

function start() {
	app.listen(port, () => console.log(`Example app listening on port ${port}`))
}

new Promise((res, rej) => {
	if(fs.existsSync(CACHE_PATH)) {
	    return res(read_saved_data(CACHE_PATH));
	}
	parse_csv("data.csv").then(data => {
		save_data(data, CACHE_PATH);
		return res(data);
	});
}).then(data => {
	DATA = data;
}).then(() => {
	start();
}).catch(err => {
	console.error(err);
});	
