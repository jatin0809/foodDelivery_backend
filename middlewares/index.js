const fs = require("fs");

const incomingRequestLogger = (req, res, next) =>{
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    fs.appendFileSync("log.txt", `${req.method} ${req.url} ${ip} ${new Date().toISOString()} \n`);
    next();
}

module.exports = {
    incomingRequestLogger
}