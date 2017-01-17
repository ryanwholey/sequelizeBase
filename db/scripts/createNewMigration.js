const fs = require('fs');
const env = require('../../.env');


function assignSemantics(memo, item) {
    item.forEach((sem, i) => {
        if ( i > 2) {
            return; 
        }
        if (memo[i]) {
            memo[i].push(sem);
        } else {
            memo[i] = [sem];
        }
    });
    
    return memo;
}

const bumpFuncs = {
    patch(semantics) {
        semantics[2] += 1;
        return semantics.join('.');
    },
    minor(semantics) {
        semantics[1] += 1;
        semantics[2] = 0; 
        return semantics.join('.');
    },
    major(semantics) {
        semantics[0] += 1;
        semantics[1] = semantics[2] = 0; 
        return semantics.join('.');
    }
}

const migrationContent = ` module.exports = {
    up: function(db, Sequelize) {
        return db.
    },

    down: function(db, Sequelize) {
        return db.
    }
}

/*
    createTable(tableName, attributes, options)
    dropTable(tableName, options)
    dropAllTables(options)
    renameTable(before, after, options)
    showAllTables(options)
    describeTable(tableName, options)
    addColumn(tableNameOrOptions, attributeName, dataTypeOrOptions, options)
    removeColumn(tableNameOrOptions, attributeName, options)
    renameColumn(before,after,options)
    addIndex(tableName, attributes, options)
    removeIndex(tableName, indexNameOrAttributes, options)
*/
`;

fs.readdir(env.MIGRATION_DIR, function(err, dir) {
    if (err) {
        throw err;
        process.exit(1);
    }

    let latest = dir
        .map((file) => file.split('.').slice(0,3).map((numString) => parseInt(numString)))
        .reduce((memo,item) => {
            if (item[0] > memo[0]) {
                return item; 
            } else if (item[0] === memo[0] && item[1] > memo[1]) {
                return item; 
            } else if (item[0] === memo[0] && item[1] === memo[1] && item[2] > memo[2]) {
                return item; 
            } else {
                return memo;
            }
        }, [0,0,0]);

    let bumpType = getBumpType();
    console.log(`latest migration is ${latest.join('.')}`);

    let filename = `${env.MIGRATION_DIR}/${bumpFuncs[bumpType](latest)}.js`;
    fs.writeFile(filename, migrationContent);
    console.log(`${filename} created`);
});

function getBumpType() {
    let args = JSON.parse(process.env.npm_config_argv).remain; 
    if (args.indexOf('minor') >= 0) {
        return 'minor'; 
    } else if (args.indexOf('major') >= 0) {
        return 'major';
    }
    return 'patch';
}
