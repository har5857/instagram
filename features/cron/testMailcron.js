// import nodemailer from 'nodemailer';
// import env from '../../config/env.js';
// function sendMail() { 
//     let mailTransporter = nodemailer.createTransport({ 
//         service: "gmail", 
//         auth: {
//             user: env.email.user,
//             pass: env.email.pass,
//         },
//     }); 
//     let mailDetails = { 
//         from: "harsh.logicgo6@gmail.com", 
//         to: "harsh.logicgo6@gmail.com", 
//         subject: "Test mail using Cron job", 
//         text: "Node.js cron job email"
//            + " testing for GeeksforGeeks"
//     }; 
//     mailTransporter.sendMail(mailDetails,  
//                     function(err, data) { 
//         if (err) { 
//             console.log("Error Occurs", err); 
//         } else { 
//             console.log("Email sent successfully"); 
//         } 
//     }); 
// } 
// export default sendMail()
 