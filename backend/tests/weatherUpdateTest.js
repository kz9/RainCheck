'use strict';

const api = require('../src/interactApi.js');
const database = require('../src/database.js');
const email = require('../src/email.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function test(){
    try {   
        let databasePath = path.join(__dirname, '..', 'data', 'raincheckDatabase.db')
        const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
        email.smtpsend('nyaataru@gmail.com', 'Seattle', 'WA', 'Rain', '70'+'F', 90);
        //let data = await weather.fetchWeather(sqlitedb, '94203');
        //await database.updateWeatherData(sqlitedb, data[0], data[1], data[2], data[3]);
        //data = await database.getWeatherData(sqlitedb, '94203');
        //let data = await database.checkZipcode(sqlitedb, '98116');
        //let data = await database.addOrUpdateUser(sqlitedb, 'jkz8889@gmail.com', '9092645829', '98115')
        //console.log(data);
        //await database.createCitiesTable(sqlitedb);
        //console.log("success!")
        //let data = await database.getRainUsers(sqlitedb);
        //console.log(data[0])
        await sqlitedb.close();
    } catch (err) {
        throw new Error(err);
    }
};

test();