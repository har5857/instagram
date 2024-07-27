// import otpGenerator from 'otp-generator';

import randomstring from "randomstring";

//Otp Gounrater
// export const generateOtp = () => {
//     const otp = otpGenerator.generate(4, { 
//         digits: true, 
//         alphabets: false, 
//         upperCase: false, 
//         lowerCase: false, 
//         specialChars: false 
//     });
//     console.log('Generated OTP:', otp);
//     return otp;
// };

export const generateOTP = () => {
    return randomstring.generate({
      length: 4,
      charset: "numeric",
    });
  }


