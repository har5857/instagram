import otpGenerator from 'otp-generator';

//Otp Gounrater
export const generateOtp = () => {
    const otp = otpGenerator.generate(4, { 
        digits: true, 
        alphabets: false, 
        upperCase: false, 
        lowerCase: false, 
        specialChars: false 
    });
    console.log('Generated OTP:', otp);
    return otp;
};


