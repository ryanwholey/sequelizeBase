const env = require('../../.env');
const exec = require('child_process').exec;
const Promise = require('bluebird');
const Sequelize = require('sequelize');

const timeLog = require('../../common/utils').timeLog;
const nodePromise = require('../../common/utils').nodePromise;

const promiseExec = (cmd) => nodePromise(exec, cmd);

Array.prototype.functionalPrint = function(template) {
    this.forEach((item, index) => timeLog(template(item)))
    return this;
}

let failedError;
let test_db;

promiseExec(`mysql -u root <<< "CREATE DATABASE IF NOT EXISTS ${env.TEST_DB} DEFAULT CHARACTER SET utf8"`)
.then(() => test_db = new Sequelize(env.TEST_DB, env.USER, env.PASS))
.then(() => timeLog(`starting migrations for ${env.TEST_DB}`))
.then(() => promiseExec(`${env.NODE_MODULES_BIN}/sequelize db:migrate --env test`))
.then((stdout) => timeLog(`${stdout}\nmigrations completed\n`))
.then(() => promiseExec('NODE_ENV=test npm run jasmineTestDB'))
.then((stdout) => {
    timeLog(stdout);
    let report = stdout.match(/.*[0-9]+\sspecs,\s.*/);
    let error = stdout.match(/'testDB' errored after/);
    
    if (report && Array.isArray(report)) {
        failedError = report[0].match(/[0-9]+\sfailure/)[0] !== '0 failure';
    }
    if (!failedError) {
        failedError = !!stdout.match(/'testDB' errored after/)
    }
})
.finally(() => { 
    timeLog('finding all tables...')
    return promiseExec(`mysql -u root -e "USE ${env.TEST_DB}; SHOW TABLES" | awk '{print $1}' | grep -v Tables_in`)
        .then((stdout) => stdout.split('\n').filter((table) => !!table).functionalPrint((item) => `dropping table ${item}...`))
        .then((tables) => Promise.all(tables.map((table) => promiseExec(`mysql -u root <<< "USE ${env.TEST_DB}; DROP TABLE ${table}"` ))))
        .then(() => timeLog('All tables removed'))
})
.finally(() => promiseExec(`rm -rf ${env.TEMP_DB_TEST_DIR}`))
.finally(() => {
    console.log('################################################');
    timeLog('test database teardown complete');
    if (failedError) {
        timeLog('Test failures found...');
        timeLog('throwing failure...');
        process.exit(1);
    }
})
.catch((err) => {
    process.exit(1);
});

