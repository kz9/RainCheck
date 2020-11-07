'use strict';

const axios = require('axios').default;
const database = require('../src/database.js');

module.exports = {
    fetchWeather: async function (db, zipcode) {
        let apiKey = "c45594f61719575f7d835accecc4b6b5";

        let latLon = await database.getZipInfo(db, zipcode);

        const res = await axios.get("https://api.openweathermap.org/data/2.5/onecall", {
                params: {
                    lat: latLon.lat,
                    lon: latLon.lon,
                    exclude: "current,minutely,hourly,alerts",
                    units: "imperial",
                    appid: apiKey
                }
            });
        let pop = res.data["daily"][0]["pop"];
        let temp = res.data["daily"][0]["temp"]["day"];
        let name = res.data["daily"][0]["weather"][0]["main"];
        return {zipcode: zipcode, pop: pop, temp: temp, name: name};
    }
};