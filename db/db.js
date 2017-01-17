const Sequelize = require('sequelize');
const env = require('../.env');
const timeLog = require('../common/utils').timeLog;

const config = {
    dev: [env.DATABASE, env.USER, env.PASS],
    test: [env.TEST_DB, env.USER, env.PASS]
};

let sequelize;

if (!sequelize) {
    timeLog('creating db connection');
    let args = config[process.env.NODE_ENV] || config.dev;
    let options = {}
    if (process.env.NODE_ENV === 'test') {
        options.logging = false;
    }
    sequelize = new Sequelize(args[0], args[1], args[2], options);
}

module.exports = (function() {
    return sequelize;
}());

