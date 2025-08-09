const GenerateOTP = () => {

    const char = "0123456789";

    let OTP = "";
    let i = 1;

    while( i <= 6 ){
        OTP = OTP + char[Math.floor( Math.random() * 10)]; 
        i++;       
    }

    return OTP

}

export default GenerateOTP;