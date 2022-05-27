const errorHandler =async (err, req, res, next)=>{
    const statusErr = err.statusCode ?? 500;
    res.status(statusErr);

    res.json({
        message:err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}
module.exports = {errorHandler}

