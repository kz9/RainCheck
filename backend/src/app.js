'use strict';

// Require packages and set the port
const express = require('express');
const createError = require('http-errors');
const port = 23333;
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const route = require('./route.js')

// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));

let corsOptions = {
    origin: [/raincheck\.cf$/,/localhost/],
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
}

app.get('/api/getWeather', cors(corsOptions), route.weatherHandler);
app.post('/api/addUser', cors(corsOptions), route.userHandler);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    //set locals, only provide error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err: {};

    // render the error page
    res.status(err.status || 500);
    res.json({error: "error"})
});

// Start the server
const server = app.listen(port, 'localhost', (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});
