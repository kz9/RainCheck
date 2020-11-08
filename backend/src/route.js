const weather = require('./interactApi.js');
const database = require('./database.js');
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

module.exports = {
    weatherHandler: async function (req, res, next) {
        try {
            let zipcode = req.query.zipcode;
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
        } catch (err) {
            throw new Error(err);
        }
    },
    userHandler: async function (req, res, next) {
        try {
            let email = req.query.email;
            let zipcode = req.query.zipcode;
            let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db')
            const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
            let res = await database.addOrUpdateUser(sqlitedb, email, zipcode);
            res.json({success: res});
        } catch (err) {
            throw new Error(err);
        }
    }
};
