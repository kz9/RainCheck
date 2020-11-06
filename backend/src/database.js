'use strict';

const fs = require('fs');
var weather = require('../src/weatherAPI.js');

module.exports = {
    createCitiesTable: async function (db) {
        try {
            let data = fs.readFileSync("backend/zipcode-geo-us.json");
            let zipcodeGeo = JSON.parse(data);
            let stmt = await db.prepare("INSERT OR REPLACE INTO cities (zipcode, city, state) VALUES(@zipcode, @city, @state)");
            for (let i = 0; i < zipcodeGeo.length; i++) {
                let zip = zipcodeGeo[i]["fields"]["zip"];
                let city = zipcodeGeo[i]["fields"]["city"];
                let state = zipcodeGeo[i]["fields"]["state"];
                await stmt.bind({'@zipcode': zip, '@city': city, '@state': state})
                stmt.run();
            } 
            await stmt.finalize();
        } catch (err) {
            throw new Error(err);
        }
    },
    addUsers: async function (db, email, phone, zipcode) {
        return new Promise(function(resolve, reject) {
            try{
                //check email
                if (phone.length != 10 && phone != null) {
                    reject("Wrong phone number.")
                }
                let checkStmt = await db.prepare("SELECT * FROM users WHERE email = @email");
                let checkResult = await checkStmt.get({"@email": email});
                if (!checkResult) {
                    let addStmt = await db.prepare("INSERT INTO users (email, phone, zipcode) VALUES(@email, @phone, @zipcode)");
                    addStmt.run({"@email": email, "@phone": phone, "@zipcode": zipcode});
                    addStmt.finalize();
                    resolve("Added user successfully.")
                } else {
                    resolve("Dupplicate user.");
                }
            } catch (err) {
                reject(err);
            }
        });
    },
    updateWeatherData: async function (db, zip, pop, temp, name) {
        try {
            let stmt = await db.prepare("INSERT OR REPLACE INTO weather (zipcode, pop, temp, name) VALUES(@zipcode, @pop, @temp, @name)");
            await stmt.bind({'@zipcode': zip, '@pop': pop, '@temp': temp, '@name': name})
            await stmt.run();
            await stmt.finalize();
        } catch (err) {
            throw new Error(err);
        }
    },
    getWeatherData: async function (db, zipcode, city) {
        try {
            if (zipcode === null && city === null) {
                throw new Error("Both zipcode and city have null value.")
            }
            let pop = null;
            let temp = null;
            let name = null;
            let state = null;
            if (zipcode) {
                let weatherStmt = await db.prepare("SELECT * FROM weather WHERE zipcode = @zipcode");
                let cityStmt = await db.prepare("SELECT * FROM cities WHERE zipcode = @zipcode");
                let weatherResult = await weatherStmt.get({"@zipcode": zipcode});
                pop = weatherResult.pop;
                temp = weatherResult.temp;
                name = weatherResult.name;
                let cityResult = await cityStmt.get({"@zipcode": zipcode});
                city = cityResult.city;
                state = cityResult.state;
                await cityStmt.finalize();
                await weatherStmt.finalize();
            } else {
                let cityStmt = await db.prepare("SELECT * FROM cities WHERE city = @city COLLATE NOCASE");
                let weatherStmt = await db.prepare("SELECT * FROM weather WHERE zipcode = @zipcode");
                let cityResult = await cityStmt.get({'@city': city});
                zipcode = cityResult.zipcode;
                state = cityResult.state;
                let weatherResult = await weatherStmt.get({'@zipcode': zipcode});
                if (!weatherResult) {
                    console.log(zipcode);
                    let data = await weather.fetchWeather(zipcode);
                    await this.updateWeatherData(db, data[0], data[1], data[2], data[3]);
                    weatherResult = await weatherStmt.get({'@city': city});
                }
                pop = weatherResult.pop;
                temp = weatherResult.temp;
                name = weatherResult.name;
                await weatherStmt.finalize();
                await cityStmt.finalize();
            }
            return [city, state, pop, temp, name]
        } catch (err) {
            throw new Error(err);
        }
    }
};