const GenerateAccessToken = async(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_STRING, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}