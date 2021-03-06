'use strict';

const weather = require('./interactApi.js');
const database = require('./database.js');
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    weatherHandler: async function (req, res, next) {
        try {
            let zipcode = req.query.zipcode;
            if (!zipcode || !(/^\d+$/.test(zipcode))) {
                res.json({error: "error"});
            } else {
                let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db')
                const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
                let zipInDatabase = await database.checkZipInWeather(sqlitedb, zipcode);
                if (zipInDatabase) {
                    let data = await database.getWeatherData(sqlitedb, zipcode);
                    res.json(data)
                } else {
                    let weatherData = await weather.fetchWeather(sqlitedb, zipcode);
                    let cityData = await database.getZipInfo(sqlitedb, zipcode);
                    res.json({city: cityData.city, state: cityData.state, pop: weatherData.pop, temp: weatherData.temp, name: weatherData.name});
                    await database.updateWeatherData(sqlitedb, zipcode, weatherData.pop, weatherData.temp, weatherData.name);
                }
                await sqlitedb.close();
            }
        } catch (err) {
            console.log(err);
        }
    },
    userHandler: async function (req, res) {
        try {
            let email = req.body.email;
            let zipcode = req.body.zipcode;
            if (!zipcode || !(/^\d+$/.test(zipcode)) || !email) {
                res.json({error: "error"});
            } else {
                let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db')
                const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
                let result = await database.addOrUpdateUser(sqlitedb, email, zipcode);
                let weatherData = await weather.fetchWeather(sqlitedb, zipcode);
                await database.updateWeatherData(sqlitedb, weatherData.zipcode, weatherData.pop, weatherData.temp, weatherData.name);
                res.json({success: result});
                await sqlitedb.close();
            }
        } catch (err) {
            console.log(err);
        }
    }
};
