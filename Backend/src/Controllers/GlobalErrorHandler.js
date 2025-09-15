const devErrors = (res, error) => {
    return res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error,
    });
}

const prodErrors = (res, error) => {
    if(error?.isOperational){
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    } else{
        return res.status(500).json({
            status: "error",
            message: "Something went wrong!! Please try again later "
        })
    }
}

export default (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    if(process.env.NODE_ENV === "development"){
        return devErrors(res, error);
    } else if(process.env.NODE_ENV === "production"){
        return prodErrors(res, error);
    }
}