const Promise = require('bluebird');

const timeLog = (string) => {
    let date = new Date();
    let time = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
    ]
    .map((unit) => unit.length === 1 ? `0${unit}` : unit);
    let [hours, minutes, seconds] = time;

    console.log(`[${hours}:${minutes}:${seconds}] ${string}`);
}

function nodePromise(func, cmd) {
    let args = Array.prototype.slice.call(arguments, 1);

    return new Promise((resolve, reject) => {
        let handler = (err, success, stderr) => {
            if (err) {
                timeLog(success);
                timeLog(stderr);
                reject(err);
            } 
            resolve(success);
        }
        args.push(handler);
        func.apply(this, args);
    });
}

module.exports = {
    timeLog,
    nodePromise
}
