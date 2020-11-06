'use strict';

const fs = require('fs');
const jsonQuery = require('json-query')
const axios = require('axios').default;

module.exports = {
    fetchWeather: async function (zipcode) {
        let apiKey = "c45594f61719575f7d835accecc4b6b5";

        let data = fs.readFileSync("backend/zipcode-geo-us.json");
        let zipcodeGeo = JSON.parse(data);
        let latLon = jsonQuery(`fields[zip=${zipcode}].geopoint`, {data: zipcodeGeo})["value"];

        const res = await axios.get("https://api.openweathermap.org/data/2.5/onecall", {
                params: {
                    lat: latLon[0],
                    lon: latLon[1],
                    exclude: "current,minutely,hourly,alerts",
                    units: "imperial",
                    appid: apiKey
                }
            });
        let pop = res.data["daily"][0]["pop"];
        let temp = res.data["daily"][0]["temp"]["day"];
        let name = res.data["daily"][0]["weather"][0]["main"];
        return [zipcode, pop, temp, name];
    }
};