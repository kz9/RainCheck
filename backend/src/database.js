'use strict';

const fs = require('fs');
const weather = require('./interactApi.js');

module.exports = {
    createCitiesTable: async function (db) {
        try {
            let data = fs.readFileSync("../../zipcode-geo-us.json");
            let zipcodeGeo = JSON.parse(data);
            let stmt = await db.prepare("INSERT OR REPLACE INTO cities (zipcode, city, state, lat, lon) VALUES(@zipcode, @city, @state, @lat, @lon)");
            for (let i = 0; i < zipcodeGeo.length; i++) {
                let zip = zipcodeGeo[i]["fields"]["zip"];
                let city = zipcodeGeo[i]["fields"]["city"];
                let state = zipcodeGeo[i]["fields"]["state"];
                let lat = zipcodeGeo[i]["fields"]["geopoint"][0];
                let lon = zipcodeGeo[i]["fields"]["geopoint"][1];
                await stmt.bind({'@zipcode': zip, '@city': city, '@state': state, '@lat': lat, '@lon': lon});
                stmt.run();
            }
            await stmt.finalize();
        } catch (err) {
            throw new Error(err);
        }
    },
    checkZipcode: async function (db, zipcode) {
        try {
            let stmt = await db.prepare("SELECT * FROM cities WHERE zipcode = @zipcode");
            let res = await stmt.get({"@zipcode": zipcode});
            stmt.finalize();
            if (!res) {
                return false;
            }
            return true;
        } catch (err) {
            throw new Error(err);
        }
    },
    checkZipInWeather: async function (db, zipcode) {
        try {
            let stmt = await db.prepare("SELECT * FROM weather WHERE zipcode = @zipcode");
            let res = await stmt.get({"@zipcode": zipcode});
            stmt.finalize();
            if (!res) {
                return false;
            }
            return true;
        } catch (err) {

        }
    },
    getZipInfo: async function (db, zipcode) {
        try {
            let stmt = await db.prepare("SELECT city, state, lat, lon FROM cities WHERE zipcode = @zipcode");
            let results = await stmt.get({'@zipcode': zipcode});
            stmt.finalize();
            return {city: results.city, state: results.state, lat: results.lat, lon: results.lon};
        } catch (err) {
            throw new Error(err);
        }
    },
    addOrUpdateUser: async function (db, email, zipcode) {
        try{
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(String(email).toLowerCase())) {
                return false;
            }
            let check = await this.checkZipcode(db, zipcode);
            if (!check) {
                return false;
            }
            let addStmt = await db.prepare("INSERT OR REPLACE INTO users (email, zipcode) VALUES(@email, @zipcode)");
            addStmt.run({"@email": email, "@zipcode": zipcode});
            addStmt.finalize();
            return true;
        } catch (err) {
            throw new Error(err);
        }
    },
    getRainUsers: async function (db) {
        try {
            let stmt = await db.prepare("SELECT users.email, users.zipcode, weather.pop, weather.temp, cities.city, cities.state "+
                                        "FROM users INNER JOIN weather ON weather.zipcode = users.zipcode "+
                                        "INNER JOIN cities ON cities.zipcode = users.zipcode "+
                                        "WHERE weather.pop >= @pop OR weather.name = @name");
            let results = await stmt.all({"@pop": 0.5, "@name": "Rain"});
            await stmt.finalize();
            return results;
        } catch (err) {
            throw new Error(err);
        }
    },
    getUserZipcodeList: async function (db) {
        let stmt = await db.prepare("select zipcode from users");
        let res = await stmt.all();
        return res;
    },
    updateWeatherData: async function (db, zip, pop, temp, name) {
        try {
            let stmt = await db.prepare("INSERT OR REPLACE INTO weather (zipcode, pop, temp, name) VALUES(@zipcode, @pop, @temp, @name)");
            await stmt.bind({'@zipcode': zip, '@pop': pop, '@temp': temp, '@name': name});
            await stmt.run();
            await stmt.finalize();
        } catch (err) {
            throw new Error(err);
        }
    },
    getWeatherData: async function (db, zipcode) {
        try {
            if (zipcode === null && city === null) {
                throw new Error("Both zipcode and city have null value.")
            }
            let weatherStmt = await db.prepare("SELECT * FROM weather WHERE zipcode = @zipcode");
            let cityStmt = await db.prepare("SELECT * FROM cities WHERE zipcode = @zipcode");
            let weatherResult = await weatherStmt.get({"@zipcode": zipcode});
            let pop = weatherResult.pop;
            let temp = weatherResult.temp;
            let name = weatherResult.name;
            let cityResult = await cityStmt.get({"@zipcode": zipcode});
            let city = cityResult.city;
            let state = cityResult.state;
            await cityStmt.finalize();
            await weatherStmt.finalize();
            return {city: city, state: state, pop: pop, temp: temp, name: name};
        } catch (err) {
            throw new Error(err);
        }
    }
};
