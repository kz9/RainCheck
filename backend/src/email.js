'use strict';

const imaps = require('imap-simple');
const nodemailer = require('nodemailer');
const database = require('./database.js');
module.exports = {
    imaprecv: async function(db) {
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

        imaps.connect(config).then(async function (connection) {

            return connection.openBox('INBOX').then(async function () {
                var searchCriteria = [
                    'UNSEEN'
                ];

                var fetchOptions = {
                    bodies: ['HEADER', 'TEXT'],
                    markSeen: true
                };

                return connection.search(searchCriteria, fetchOptions).then(async function (results) {
                    var subjects = results.map(function (res) {
                        return [res.parts.filter(function (part) {
                            return part.which === 'HEADER';
                        })[0].body.subject[0], res.parts.filter(function (part) {
                            return part.which === 'HEADER';
                        })[0].body.from[0]];
                    });

                    for (let i = 0; i < subjects.length; i++) {
                        if (subjects[0].toLowerCase().includes("unsubscribe")) {
                            await database.deleteUser(db, subjects[1]);
                        }
                    }
                    return subjects;
                });
            });
        });
    },
    smtpsend: async function () {
        const smtpConfig = {
            host: 'smtp.raincheck.tk',
            port: 25,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'mailadmin',
                pass: 'a13857798889'
            }
        }
        const transport = nodemailer.createTransport(smtpConfig);
        transport.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take out message")
            }
        });
        let message = {
            from: 'Notice <alerts@raincheck.tk>',
            to: '<jkz8889@gmail.com>',
            list: {
                help: 'admin@raincheck.tk?subject=help',
                unsubscribe: [
                    'list@raincheck.tk?subject=unsubscribe',
                    {
                    url: 'https://raincheck.tk/unsubscribe',
                    comment: 'One-Click'
                    }
                ]
            },
            subject: 'raincheck notify',
            text: 'Dear user,\nThis is a samle rinacheck notification from raincheck.tk\nBest regards,\nrinacheck.tk',
            //html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
            //amp: `<!doctype html>
            //<html ⚡4email>
            //  <head>
            //    <meta charset="utf-8">
            //    <style amp4email-boilerplate>body{visibility:hidden}</style>
            //    <script async src="https://cdn.ampproject.org/v0.js"></script>
            //    <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
            //  </head>
            //  <body>
            //    <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
            //    <p>GIF (requires "amp-anim" script in header):<br/>
            //      <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
            //  </body>
            //</html>`
        }
        let info = await transport.sendMail(message);
        console.log(info);
        for (let i in info) {
            if (i.toString() === "envelope") {
                let j = 0;
                for (j; j < info.envelope.length; j++) {
                    console.log(`Envelope item${j}:`)
                    console.log(info.envelope[j]);
                }
                if (j === 0) {
                    console.log("No content in envelope key")
                }
            } else{
                console.log(i + ": " + info[i]);
            }
        }
    }
}
