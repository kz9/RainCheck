'use strict';

// Require packages and set the port
const express = require('express');
const createError = require('http-errors');
const port = 23333;
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const schedule = require('node-schedule');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const route = require('./route.js');
const weather = require('./interactApi.js');
const database = require('./database.js');
const email = require('./email.js');
const path = require("path");

// run schedule task
let fetchjob = schedule.scheduleJob('0 0 12 * * *', async function() {
    try {
    	let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db');
    	const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
    	let list = await database.getWeatherZipcodeList(sqlitedb);
    	for (let i = 0; i < list.length; i++) {
    	    let weatherData = await weather.fetchWeather(sqlitedb, list[i].zipcode);
    	    await database.updateWeatherData(sqlitedb, weatherData.zipcode, weatherData.pop, weatherData.temp, weatherData.name);
    	}
    	await sqlitedb.close();
    } catch (err) {
	console.log(err);
    }
});

//let checkEmailJob = schedule.scheduleJob('0 30 12 * * *', async function() {
//    try {
//    	let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db');
//    	const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
//    	await email.imaprecv(sqlitedb);
//    } catch (err) {
//	cosole.log(err);
//    }
//});
//
//let sendEmail = schedule.scheduleJob('0 59 12 * * *', async function() {
//    try {
//    	let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db');
//    	const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
//    	let res = await database.getRainUsers(sqlitedb);
//    	if (res) {
//    	    for (let i = 0; i < res.length; i++) {
//    	        await email.smtpsend(res[i].email, res[i].city, res[i].state, res[i].name, res[i].temp + 'F', (res[i].pop * 100) + '%');
//    	    }
//    	}
//    } catch (err) {
//	    console.log(err);
//    }
//});

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
//let corsOptions = {
//    origin: [/raincheck\.tk$/,/localhost/,/127.0.0.1/],
//    methods: ['GET', 'POST'],
//    optionsSuccessStatus: 200
//}

//app.get('/api/getWeather', cors(corsOptions), route.weatherHandler);
app.get('/api/getWeather', route.weatherHandler);
//app.post('/api/addUser', cors(corsOptions), route.userHandler);
app.post('/api/addUser', route.userHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    //set locals, only provide error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err: {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: "error"})
});

// Start the server
const server = app.listen(port, 'localhost', (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
