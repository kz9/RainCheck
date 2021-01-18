'use strict';

const imaps = require('imap-simple');
const nodemailer = require('nodemailer');
const database = require('./database.js');
module.exports = {
    imaprecv: async function(db) {
        const config = {
            imap: {
                user: 'mailadmin',
                password: 'a13857798889',
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
    smtpsend: async function (email, city, state, name, temp, pop) {
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
            from: 'Raincheck.tk <alerts@raincheck.tk>',
            to: `<${email}>`,
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
            subject: 'Raincheck notification',
            text: `Raincheck Notification from rinacheck.tk\n\n
            Today Weather: ${name} in ${city}, ${state}\n
            Temperatire: ${temp}\n
            Probability of Raining: ${pop}%\n\n
            Please don't forget to bring your umbrella!`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html>
              <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <title>Raincheck Notification</title>
                <style type="text/css">
                  body{width:100% !important;} .ReadMsgBody{width:100%;} .ExternalClass{width:100%;} /* Force Hotmail to display emails at full width */
                  body{-webkit-text-size-adjust:none;} /* Prevent Webkit platforms from changing default text sizes. */
                  body{margin:0; padding:0;}
                  img{border:0; height:auto; line-height:100%; outline:none; text-decoration:none;}
                  table td{border-collapse:collapse;}
                  #backgroundTable{height:100% !important; margin:0; padding:0; width:100% !important;}
            
                  body, #backgroundTable{
                    background-color:#FAFAFA;
                  }
            
                  #templateContainer{
                    border: 1px solid #DDDDDD;
                  }
            
                  h1, .h1{
                    color:#202020;
                    display:block;
                    font-family:Arial;
                    font-size:34px;
                    font-weight:bold;
                    line-height:100%;
                    margin-top:0;
                    margin-right:0;
                    margin-bottom:10px;
                    margin-left:0;
                    text-align:center;
                  }
            
                  h2, .h2{
                    color:#202020;
                    display:block;
                    font-family:Arial;
                    font-size:30px;
                    font-weight:bold;
                    line-height:100%;
                    margin-top:0;
                    margin-right:0;
                    margin-bottom:10px;
                    margin-left:0;
                    text-align:center;
                    opacity:0.7;
                  }
            
                  h3, .h3{
                    color:#202020;
                    display:block;
                    font-family:Arial;
                    font-size:26px;
                    font-weight:bold;
                    line-height:100%;
                    margin-top:0;
                    margin-right:0;
                    margin-bottom:10px;
                    margin-left:0;
                    text-align:center;
                    opacity:0.7;
                  }
            
                  #templateContainer, .bodyContent{
                    background-color:#FFFFFF;
                  }
            
                  .bodyContent div{
                    color:#505050;
                    font-family:Arial;
                    font-size:14px;
                    line-height:150%;
                    text-align:left;
                  }
            
                  .bodyContent div a:link, .bodyContent div a:visited, /* Yahoo! Mail Override */ .bodyContent div a .yshortcuts /* Yahoo! Mail Override */{
                    color:#336699;
                    font-weight:normal;
                    text-decoration:underline;
                  }
            
                  .bodyContent img{
                    display:inline;
                    height:auto;
                  }
            
                  #templateFooter{
                    background-color:#FFFFFF;
                    border-top:0;
                  }
            
                  .footerContent div{
                    color:#707070;
                    font-family:Arial;
                    font-size:12px;
                    line-height:125%;
                    text-align:left;
                  }
            
                  .footerContent div a:link, .footerContent div a:visited, /* Yahoo! Mail Override */ .footerContent div a .yshortcuts /* Yahoo! Mail Override */{
                    color:#336699;
                    font-weight:normal;
                    text-decoration:underline;
                  }
            
                  .footerContent img{
                    display:inline;
                  }
            
                  #utility div{
                    text-align:center;
                  }
            
                  #umbrella{
                    text-align:center;
                  }
            
                </style>
              </head>
              <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
                <center>
                  <table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="backgroundTable">
                    <tr>
                      <td align="center" valign="top">
                        <table border="0" cellpadding="10" cellspacing="0" width="600" id="templatePreheader">
                            <tr>
                                <td valign="top" class="preheaderContent"></td>
                            </tr>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateContainer">
                          <tr>
                            <td align="center" valign="top">
                              <table border="0" cellpadding="0" cellspacing="0" width="600" id="templateBody">
                                <tr>
                                  <td valign="top" class="bodyContent">
                                    <table border="0" cellpadding="20" cellspacing="0" width="100%">
                                      <tr>
                                        <td valign="top">
                                          <div>
                                            <h1 class="h1">Raincheck Notification</h1>
                                            <br />
                                            <strong>Today Weather:</strong> ${name} in ${city}, ${state}
                                            <br />
                                            <strong>Temperature:</strong> ${temp}
                                            <br />
                                            <strong>Probability of Raining</strong> ${pop}
                                            <br />
                                          </div>
                                          <div id="umbrella">
                                            <br />
                                                <strong>Please don't forget to bring your umbrella!</strong>
                                            <br />
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" valign="top">
                              <table border="0" cellpadding="10" cellspacing="0" width="600" id="templateFooter">
                                <tr>
                                  <td valign="top" class="footerContent">
                                    <table border="0" cellpadding="10" cellspacing="0" width="100%">
                                      <tr>
                                        <td colspan="2" valign="middle" id="utility">
                                          <div>
                                            <a href="https://raincheck.tk/unsubscribe">Manage Subscription</a>
                                          </div>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </center>
              </body>
            </html>
            `
        }
        let info = await transport.sendMail(message);
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
