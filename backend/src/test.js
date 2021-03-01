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
async function test() {
	let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db');
	const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
	let list = await database.getUserZipcodeList(sqlitedb);
	for (let i = 0; i < list.length; i++) {
		console.log("test1");
		let weatherData = await weather.fetchWeather(sqlitedb, list[i].zipcode);
		console.log(weatherData.zipcode + "  " + weatherData.pop + "   " + weatherData.temp);
		await database.updateWeatherData(sqlitedb, weatherData.zipcode, weatherData.pop, weatherData.temp, weatherData.name);
	}
	await sqlitedb.close();
}
test();
