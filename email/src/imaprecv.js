'use strict';

const imaps = require('imap-simple');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const database = require('./database.js')
 
const config = {
    imap: {
        user: 'mailadmin',
        password: 'a password',
        host: 'smtp.raincheck.tk',
        port: 993,
        tls: true,
        authTimeout: 90000
    }
};
 
imaps.connect(config).then(function (connection) {
 
    return connection.openBox('INBOX').then(function () {
        var searchCriteria = [
            'UNSEEN'
        ];
 
        var fetchOptions = {
            bodies: ['HEADER', 'TEXT'],
            markSeen: false
        };
 
        return connection.search(searchCriteria, fetchOptions).then(function (results) {
            var subjects = results.map(function (res) {
                return [res.parts.filter(function (part) {
                    return part.which === 'HEADER';
                })[0].body.subject[0], res.parts.filter(function (part) {
                    return part.which === 'HEADER';
                })[0].body.from[0]];
            });

            for (let i = 0; i < subjects.length; i++) {
                if (subjects[0].toLowerCase().includes("unsubscribe")) {
                    let databasePath = path.join(__dirname, '..', '..', 'backend', 'data', 'raincheckDatabase.db')
                    const sqlitedb = await open({filename: databasePath, driver: sqlite3.Database});
                    await database.deleteUser(sqlitedb, subjects[1]);
                }
            }
            return subjects;
        });
    });
});