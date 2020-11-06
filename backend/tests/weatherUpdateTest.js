'use strict';

var weather = require('../src/weatherAPI.js');
var database = require('../src/database.js');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function test(){
    try {   

        const sqlitedb = await open({filename: 'backend/data/raincheckDatabase.db', driver: sqlite3.Database});
        //let data = await weather.fetchWeather('98115', database.updateWeatherData);
        //await database.updateWeatherData(sqlitedb, data[0], data[1], data[2], data[3]);
        //let data = await database.getWeatherData(sqlitedb, null, 'seattle');
        //console.log(data);
        //await database.createCitiesTable(sqlitedb);
        //console.log("success!")
        await sqlitedb.close();
    } catch (err) {
        throw new Error(err);
    }
};

test();