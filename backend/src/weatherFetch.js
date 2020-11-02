'use strict';

const { callbackify } = require('util');

async function fetchWeather(zipcode, callback) {
    const fs = require('fs');
    var unirest = require('unirest');
    var jsonQuery = require('json-query')
    let apiKey = "c45594f61719575f7d835accecc4b6b5";

    let data = fs.readFileSync("backend/zipcode-geo-us.json");
    let zipcodeGeo = JSON.parse(data);
    let latLon = jsonQuery(`fields[zip=${zipcode}].geopoint`, {data: zipcodeGeo})["value"];

    const res = await unirest
        .get("https://api.openweathermap.org/data/2.5/onecall")
        .query({
            "lat": latLon[0],
            "lon": latLon[1],
            "exclude": "current,minutely,hourly,alerts",
            "units": "imperial",
            "appid": apiKey
        })
        .end((res) => {
            if (res.error) {
                throw new Error(res.error);
            }
            //The first dictionary in daily array is the data of current day.
            //console.log(res.body["daily"][0]["weather"][0]);
            console.log(res.body)
            let dayTemp = res.body["daily"][0]["temp"]["day"];
            let dayPop = res.body["daily"][0]["pop"];
            let dayID = res.body["daily"][0]["weather"][0]["id"];
            callback(zipcode, dayTemp, dayPop, dayID);
        });    
};
fetchWeather(98115, (zip, temp, pop, id) => {console.log(zip,temp,pop, id)});