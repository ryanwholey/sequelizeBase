const env = require('../../.env');
const fs = require('fs');
const path = require('path');

const _modelDir = `${env.MODEL_DIR}/_models`;
const ignoreFiles = {
    'SequelizeMeta.js': 'SequelizeMeta.js'
}

fs.stat(_modelDir, (err) => {
    if (err) {
        console.log('No _models directory found, try running npm run autoModel') 
        process.exit(1);
    }
    console.log(`${env.MODEL_DIR}/_models directory found...`);
});

function getFileContents(fileNameObj) {
    const original = fileNameObj.original.split('.').shift();
    const exportName = fileNameObj.new.split('.').shift();

    const contents = [
        '// THIS FILE HAS BEEN GENERATED',
        `var ${exportName};`,
        'try {',
            `\t${exportName} = require("${path.resolve(env.MODEL_DIR, '_models', original)}");`,
        '} catch(e) {',
            '\tconsole.log("no models in _models found, try running npm run autoModel");',
            '\tprocess.exit(1);',
        '}',
        'var db = require("../db");',
        'var Sequelize = require("sequelize");',
        `module.exports = ${exportName}(db, Sequelize);`
    ].join('\n');
    
    return contents;
}

function writeFile(fileNameObj) {
    const filePath = `${env.MODEL_DIR}/${fileNameObj.new}`;

    fs.writeFile(filePath, getFileContents(fileNameObj), (err) => {
        if (err) {
            console.log(`could not write file ${filePath}: ${err}`);
            process.exit(1);
        }
        console.log(`${filePath} written successfully.`);
    });
}

fs.readdir(_modelDir, (err, dir) => {
    if (err) {
        console.log(`error reading from ${_modelDir}: ${err}`); 
        process.exit(1);
    }

    var fileNames = dir
        .map((file) => file.split('.').shift())
        .map((name) => name[0].toUpperCase().concat(name.substr(1)))
        .map((name) => name[name.length - 1] === 's' ? name.substr(0, name.length - 1) : name) 
        .map((name) => name.concat('.js'))
        .map((name, i) => ({original: dir[i], new: name}))
        .filter((nameObj) => !ignoreFiles[nameObj.new])
        .forEach(writeFile)
});
